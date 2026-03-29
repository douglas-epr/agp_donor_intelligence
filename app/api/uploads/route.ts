import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseCsvText } from '@/lib/csv/parser';

/**
 * POST /api/uploads
 *
 * Accepts a multipart/form-data request with a CSV file,
 * parses and validates each row, and returns validation results with a preview.
 *
 * RULES.MD Rule 0: user_id is extracted from the authenticated session only.
 * No user_id is accepted from the request body.
 *
 * Body: FormData with `file` field (CSV)
 *
 * Response 201:
 * {
 *   uploadId: string | null,
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

  // MVP: return results without persisting to DB (mock phase)
  // When DB is ready: insert into uploads + donor_gifts tables here.
  console.info(`Upload processed: ${file.name} | valid=${parseResult.validRows.length} rejected=${parseResult.rejectedRows.length} user=${user.id}`);

  return NextResponse.json(
    {
      uploadId: null, // will be a real UUID when DB is connected
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
