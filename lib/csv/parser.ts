import { donorGiftRowSchema, type CsvParseResult, type RowError } from './schema';
import { CSV_MAX_ROWS, CSV_PREVIEW_ROWS } from '@/lib/constants';

/**
 * Parses a raw CSV string into validated donor gift rows.
 *
 * Handles gracefully:
 * - Missing required fields (flagged with warning)
 * - Malformed dates (row rejected)
 * - Non-numeric gift amounts (row rejected)
 * - Unknown extra columns (ignored)
 * - Up to CSV_MAX_ROWS rows (remainder silently dropped)
 *
 * @param {string} csvText - Raw CSV file content.
 * @returns {CsvParseResult} Valid rows, rejected rows, totals, and preview.
 * @throws {Error} If the file is empty or has no parseable header row.
 */
export function parseCsvText(csvText: string): CsvParseResult {
  const lines = csvText.trim().split(/\r?\n/);

  if (lines.length < 2) {
    throw new Error('CSV file appears to be empty or missing a header row.');
  }

  const headers = parseHeaders(lines[0]);
  const dataLines = lines.slice(1, CSV_MAX_ROWS + 1);

  const validRows = [];
  const rejectedRows: RowError[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue; // skip blank lines

    const rowNumber = i + 2; // 1-indexed, accounting for header
    const rawValues = parseCsvLine(line);
    const rawData: Record<string, string> = {};

    headers.forEach((header, idx) => {
      rawData[header] = rawValues[idx]?.trim() ?? '';
    });

    const result = donorGiftRowSchema.safeParse(rawData);

    if (result.success) {
      validRows.push(result.data);
    } else {
      const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      rejectedRows.push({ rowNumber, rawData, errors });
    }
  }

  return {
    validRows,
    rejectedRows,
    totalRows: validRows.length + rejectedRows.length,
    previewRows: validRows.slice(0, CSV_PREVIEW_ROWS),
  };
}

/**
 * Parses the CSV header row, normalizing to lowercase with underscores.
 *
 * @param {string} headerLine - The first line of the CSV.
 * @returns {string[]} Normalized header names.
 */
function parseHeaders(headerLine: string): string[] {
  return parseCsvLine(headerLine).map((h) =>
    h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  );
}

/**
 * Splits a single CSV line into fields, handling quoted values with commas.
 *
 * @param {string} line - A single CSV line.
 * @returns {string[]} Parsed field values.
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote inside quoted field
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
