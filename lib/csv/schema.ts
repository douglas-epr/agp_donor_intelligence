import { z } from 'zod';

/**
 * Zod schema for a single donor gift row parsed from a CSV upload.
 * Applied per-row — validation failures produce RowError entries.
 */
export const donorGiftRowSchema = z.object({
  donor_id: z.string().min(1, 'donor_id is required'),
  donor_name: z.string().optional().default(''),
  segment: z.string().optional().default('General'),
  gift_date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'gift_date must be a valid date (e.g., 2024-03-15)' }
  ),
  gift_amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val.replace(/[,$]/g, ''))), {
      message: 'gift_amount must be a numeric value',
    })
    .transform((val) => parseFloat(val.replace(/[,$]/g, ''))),
  campaign: z.string().optional().default(''),
  channel: z.string().optional().default(''),
  region: z.string().optional().default(''),
});

export type DonorGiftRow = z.infer<typeof donorGiftRowSchema>;

/** A row that failed validation. */
export interface RowError {
  rowNumber: number;
  rawData: Record<string, string>;
  errors: string[];
}

/** Result of parsing a CSV file. */
export interface CsvParseResult {
  validRows: DonorGiftRow[];
  rejectedRows: RowError[];
  totalRows: number;
  previewRows: DonorGiftRow[];
}
