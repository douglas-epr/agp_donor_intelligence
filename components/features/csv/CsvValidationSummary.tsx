import { Badge } from '@/components/ui/Badge';
import type { RowError } from '@/lib/csv/schema';

interface CsvValidationSummaryProps {
  /** Number of successfully validated rows. */
  validCount: number;
  /** Number of rejected rows. */
  rejectedCount: number;
  /** Rejected row details for display. */
  rejectedRows: RowError[];
}

/**
 * Shows a summary of CSV validation results: valid rows, rejected rows,
 * and per-row error messages for rejected entries.
 */
export function CsvValidationSummary({
  validCount,
  rejectedCount,
  rejectedRows,
}: CsvValidationSummaryProps) {
  return (
    <div className="space-y-3">
      {/* Counts */}
      <div className="flex items-center gap-3">
        <Badge label={`${validCount} valid rows`} variant="success" />
        {rejectedCount > 0 && (
          <Badge label={`${rejectedCount} rejected rows`} variant="warning" />
        )}
      </div>

      {/* Rejected row errors */}
      {rejectedRows.length > 0 && (
        <details className="rounded-lg border border-amber-200 bg-amber-50">
          <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100 rounded-lg">
            View {rejectedRows.length} rejected row{rejectedRows.length !== 1 ? 's' : ''}
          </summary>
          <div className="divide-y divide-amber-100 px-4 pb-3">
            {rejectedRows.map((row) => (
              <div key={row.rowNumber} className="py-2">
                <p className="text-xs font-semibold text-amber-900">
                  Row {row.rowNumber}{' '}
                  {row.rawData.donor_name && (
                    <span className="font-normal text-amber-700">
                      — {row.rawData.donor_name}
                    </span>
                  )}
                </p>
                <ul className="mt-1 list-inside list-disc space-y-0.5">
                  {row.errors.map((error, i) => (
                    <li key={i} className="text-xs text-amber-700">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
