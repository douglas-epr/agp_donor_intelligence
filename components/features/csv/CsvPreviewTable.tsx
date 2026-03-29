import { formatCurrency } from '@/lib/utils';
import type { DonorGiftRow } from '@/lib/csv/schema';

interface CsvPreviewTableProps {
  /** Rows to display in the preview (first 10). */
  rows: DonorGiftRow[];
}

const COLUMNS: { key: keyof DonorGiftRow; label: string }[] = [
  { key: 'donor_id', label: 'Donor ID' },
  { key: 'donor_name', label: 'Name' },
  { key: 'segment', label: 'Segment' },
  { key: 'gift_date', label: 'Gift Date' },
  { key: 'gift_amount', label: 'Amount' },
  { key: 'campaign', label: 'Campaign' },
  { key: 'channel', label: 'Channel' },
  { key: 'region', label: 'Region' },
];

/**
 * Preview table showing the first N valid rows from a CSV upload.
 *
 * @param {CsvPreviewTableProps} props
 * @param {DonorGiftRow[]} props.rows - Up to 10 preview rows.
 */
export function CsvPreviewTable({ rows }: CsvPreviewTableProps) {
  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, idx) => (
            <tr key={`${row.donor_id}-${idx}`} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                {row.donor_id}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-brand-text">
                {row.donor_name || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{row.segment}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{row.gift_date}</td>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-brand-text">
                {formatCurrency(row.gift_amount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{row.campaign || '—'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{row.channel || '—'}</td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{row.region || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
