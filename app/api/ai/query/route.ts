import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { buildDonorContext, buildSystemPrompt } from '@/lib/ai/queryBuilder';
import { env } from '@/lib/env';
import type { DonorGift } from '@/lib/data/mockDonors';

/**
 * POST /api/ai/query
 *
 * Accepts a natural language question, builds a structured donor data context,
 * and streams a Claude response grounded in the actual dataset.
 *
 * Body: { question: string }
 *
 * Response: text/event-stream (Server-Sent Events)
 *
 * RULES.MD Rule 0: user_id from session only. Anthropic API key server-side only.
 * PII: donor_name is intentionally excluded from the SELECT — never sent to Claude.
 * Defense-in-depth: .eq('user_id', user.id) in addition to RLS (RULES.MD Rule 10).
 */
export async function POST(request: NextRequest) {
  // Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(
      JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse request body
  let question: string;
  try {
    const body = await request.json();
    question = body.question?.trim();
  } catch {
    return new Response(
      JSON.stringify({ error: { code: 'INVALID_REQUEST', message: 'Request body must be JSON with a "question" field.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!question || question.length < 3) {
    return new Response(
      JSON.stringify({ error: { code: 'INVALID_QUESTION', message: 'Please enter a question.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (question.length > 500) {
    return new Response(
      JSON.stringify({ error: { code: 'QUESTION_TOO_LONG', message: 'Question must be under 500 characters.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Fetch donor data — donor_name intentionally omitted to avoid sending PII to Claude
  const { data: gifts, error: dbError } = await supabase
    .from('donor_gifts')
    .select('donor_id, segment, gift_date, gift_amount, campaign, channel, region')
    .eq('user_id', user.id)
    .order('gift_date', { ascending: true });

  if (dbError) {
    console.error('POST /api/ai/query db error:', dbError);
    return new Response(
      JSON.stringify({ error: { code: 'DB_ERROR', message: 'Failed to load donor data.' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const donorGifts: DonorGift[] = (gifts ?? []).map((row) => ({
    donor_id: row.donor_id,
    donor_name: '', // PII — never sent to Claude
    segment: row.segment ?? '',
    gift_date: row.gift_date,
    gift_amount: Number(row.gift_amount),
    campaign: row.campaign ?? '',
    channel: row.channel ?? '',
    region: row.region ?? '',
  }));

  const context = buildDonorContext(donorGifts);
  const systemPrompt = buildSystemPrompt(context);

  // Stream response from Claude
  const anthropic = new Anthropic({ apiKey: env.anthropicApiKey() });

  try {
    const stream = await anthropic.messages.stream({
      model: env.anthropicModel(),
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
    });

    // Convert Anthropic stream to Web ReadableStream (SSE)
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const text = chunk.delta.text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (err) {
          console.error('Anthropic stream error:', { userId: user.id, error: err });
          controller.enqueue(
            new TextEncoder().encode('\n\n[Error: failed to complete response]')
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('POST /api/ai/query error:', { userId: user.id, error: err });
    return new Response(
      JSON.stringify({ error: { code: 'AI_ERROR', message: 'Failed to connect to AI service. Please try again.' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
