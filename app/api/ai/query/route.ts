import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { mockDonors } from '@/lib/data/mockDonors';
import { buildDonorContext, buildSystemPrompt } from '@/lib/ai/queryBuilder';
import { env } from '@/lib/env';

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
 * AI context: never passes raw donor names or PII — only aggregated summaries.
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

  // Build context — MVP uses mock data; swap for real Supabase query when DB connected
  const context = buildDonorContext(mockDonors);
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
