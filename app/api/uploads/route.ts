import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { parseCsvText } from '@/lib/csv/parser';

/**
 * POST /api/uploads
 *
 * Accepts a multipart/form-data request with a CSV file,
 * parses and validates each row, persists to DB, and returns results.
 *
 * RULES.MD Rule 0: user_id is extracted from the authenticated session only.
 * No user_id is accepted from the request body.
 * Uses createAdminClient() for writes — trusted server operation, bypasses RLS.
 *
 * Body: FormData with `file` field (CSV)
 *
 * Response 201:
 * {
 *   uploadId: string,
 *   rowCount: number,
 *   rejectedCount: number,
 *   preview: DonorGiftRow[],
 *   rejectedRows: RowError[]
 * }
 */
export async function POST(request: NextRequest) {
  // Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'You must be logged in to upload data.' } },
      { status: 401 }
    );
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_REQUEST', message: 'Request must be multipart/form-data.' } },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: { code: 'MISSING_FILE', message: 'No CSV file was included in the request.' } },
      { status: 400 }
    );
  }

  if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
    return NextResponse.json(
      { error: { code: 'INVALID_FILE_TYPE', message: 'Only CSV files are accepted.' } },
      { status: 400 }
    );
  }

  // Read and parse CSV
  let csvText: string;
  try {
    csvText = await file.text();
  } catch {
    return NextResponse.json(
      { error: { code: 'FILE_READ_ERROR', message: 'Failed to read the uploaded file.' } },
      { status: 400 }
    );
  }

  let parseResult;
  try {
    parseResult = parseCsvText(csvText);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse CSV.';
    console.error('CSV parse error:', { filename: file.name, error: message });
    return NextResponse.json(
      { error: { code: 'PARSE_ERROR', message } },
      { status: 422 }
    );
  }

  const adminClient = createAdminClient();

  // Create upload record
  const { data: uploadRecord, error: uploadInsertError } = await adminClient
    .from('uploads')
    .insert({
      user_id: user.id,
      filename: file.name,
      row_count: parseResult.validRows.length,
      rejected_count: parseResult.rejectedRows.length,
      status: 'processing',
    })
    .select('id')
    .single();

  if (uploadInsertError || !uploadRecord) {
    console.error('Failed to create upload record:', uploadInsertError);
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Failed to save upload. Please try again.' } },
      { status: 500 }
    );
  }

  const uploadId = uploadRecord.id as string;

  // Bulk-insert donor gifts
  if (parseResult.validRows.length > 0) {
    const rows = parseResult.validRows.map((row) => ({
      upload_id: uploadId,
      user_id: user.id,
      donor_id: row.donor_id,
      donor_name: row.donor_name,
      segment: row.segment,
      gift_date: row.gift_date,
      gift_amount: row.gift_amount,
      campaign: row.campaign,
      channel: row.channel,
      region: row.region,
    }));

    const { error: giftsError } = await adminClient.from('donor_gifts').insert(rows);

    if (giftsError) {
      console.error('Failed to insert donor gifts:', giftsError);
      await adminClient
        .from('uploads')
        .update({ status: 'error', error_message: 'Failed to persist donor records.' })
        .eq('id', uploadId);

      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Failed to save donor records. Please try again.' } },
        { status: 500 }
      );
    }
  }

  // Mark upload complete
  await adminClient.from('uploads').update({ status: 'complete' }).eq('id', uploadId);

  console.info(`Upload complete: ${file.name} | valid=${parseResult.validRows.length} rejected=${parseResult.rejectedRows.length} user=${user.id} uploadId=${uploadId}`);

  return NextResponse.json(
    {
      uploadId,
      filename: file.name,
      rowCount: parseResult.validRows.length,
      rejectedCount: parseResult.rejectedRows.length,
      totalRows: parseResult.totalRows,
      preview: parseResult.previewRows,
      rejectedRows: parseResult.rejectedRows,
    },
    { status: 201 }
  );
}
