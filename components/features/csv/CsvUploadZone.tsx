'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import type { DonorGiftRow, RowError } from '@/lib/csv/schema';
import { ROUTES } from '@/lib/constants';

interface UploadResult {
  uploadId: string | null;
  filename: string;
  rowCount: number;
  rejectedCount: number;
  totalRows: number;
  preview: DonorGiftRow[];
  rejectedRows: RowError[];
}

type UploadState = 'idle' | 'uploading' | 'preview';

const TABLE_COLS = [
  { key: 'donor_id', label: 'DONOR_ID' },
  { key: 'donor_name', label: 'NAME' },
  { key: 'segment', label: 'SEGMENT' },
  { key: 'gift_date', label: 'DATE' },
  { key: 'gift_amount', label: 'AMOUNT' },
  { key: 'status', label: 'STATUS' },
] as const;

/**
 * CSV upload zone with two-column layout:
 * Left — drop zone / validation summary / confirm action.
 * Right — data preview table with STATUS column.
 */
export function CsvUploadZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  async function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setErrorMessage('Only CSV files are accepted. Please select a .csv file.');
      return;
    }
    setErrorMessage(null);
    setState('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error?.message ?? 'Failed to process the CSV file. Please try again.');
        setState('idle');
        return;
      }
      setUploadResult({ ...data, filename: file.name });
      setState('preview');
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setState('idle');
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleConfirm() {
    if (uploadResult) {
      sessionStorage.setItem('activeUpload', JSON.stringify(uploadResult));
    }
    router.push(ROUTES.DASHBOARD);
  }

  function handleReset() {
    setState('idle');
    setUploadResult(null);
    setErrorMessage(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  // Merge valid + rejected rows for the preview table (up to 10 combined)
  const previewRows: Array<DonorGiftRow & { _status: 'valid' | 'error' }> = uploadResult
    ? [
        ...uploadResult.preview.slice(0, 8).map((r) => ({ ...r, _status: 'valid' as const })),
        ...uploadResult.rejectedRows.slice(0, 2).map((r) => ({
          donor_id: r.rawData.donor_id ?? '—',
          donor_name: r.rawData.donor_name ?? '—',
          segment: r.rawData.segment ?? '—',
          gift_date: r.rawData.gift_date ?? '—',
          gift_amount: typeof r.rawData.gift_amount === 'number' ? r.rawData.gift_amount : 0,
          campaign: r.rawData.campaign ?? '',
          channel: r.rawData.channel ?? '',
          region: r.rawData.region ?? '',
          _status: 'error' as const,
        })),
      ]
    : [];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[380px_1fr]">
      {/* ── Left column ── */}
      <div className="flex flex-col gap-4">
        {/* Drop zone or processing */}
        {state !== 'preview' ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload CSV file — click or drag and drop"
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-14 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-brand-secondary bg-blue-50'
                : state === 'uploading'
                ? 'border-brand-secondary bg-blue-50'
                : 'border-gray-200 bg-white hover:border-brand-secondary hover:bg-blue-50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => state !== 'uploading' && inputRef.current?.click()}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && state !== 'uploading')
                inputRef.current?.click();
            }}
          >
            {state === 'uploading' ? (
              <>
                <svg className="mb-3 h-10 w-10 animate-spin text-brand-secondary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-[13px] font-semibold text-brand-secondary">Parsing & validating…</p>
              </>
            ) : (
              <>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-[14px] font-semibold text-brand-text">Drag &amp; Drop</p>
                <p className="mt-1 text-[12px] text-gray-400">
                  or{' '}
                  <span className="font-medium text-brand-secondary underline">Browse Files</span>
                </p>
                <div className="mt-4 flex items-center gap-3 text-[11px] text-gray-400">
                  <span>Support: CSV format</span>
                  <span className="text-gray-200">|</span>
                  <span>Max rows: 10,000</span>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Validation summary card */
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-brand-text">Validation Summary</h3>
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Scan
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-[12px] font-medium text-green-700">Rows accepted</span>
                </div>
                <span className="text-[13px] font-bold text-green-700">{uploadResult!.rowCount}</span>
              </div>
              {uploadResult!.rejectedCount > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <span className="text-[12px] font-medium text-red-600">Rows rejected</span>
                  </div>
                  <span className="text-[13px] font-bold text-red-600">{uploadResult!.rejectedCount}</span>
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-[12px] text-gray-500">Source file</span>
                <span className="max-w-[160px] truncate text-[11px] font-medium text-brand-text">{uploadResult!.filename}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
            <p className="text-[12px] text-red-700">{errorMessage}</p>
          </div>
        )}

        {/* Actions */}
        {state === 'preview' && (
          <div className="space-y-2">
            <button
              onClick={handleConfirm}
              disabled={!uploadResult || uploadResult.rowCount === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#162d58] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Import
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <button
              onClick={handleReset}
              className="flex w-full items-center justify-center rounded-lg border border-gray-200 py-2.5 text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              Upload different file
            </button>
          </div>
        )}
      </div>

      {/* ── Right column — Data Preview ── */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3.5">
          <h3 className="text-[13px] font-bold text-brand-text">Data Preview</h3>
          {uploadResult && (
            <span className="rounded-full bg-brand-bg px-2.5 py-1 text-[10px] font-semibold text-brand-primary">
              {uploadResult.rowCount} rows ready
            </span>
          )}
        </div>

        {!uploadResult ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              <svg className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h.008v.008h-.008V8.25Zm0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m0 0h-17.25" />
              </svg>
            </div>
            <p className="text-[13px] font-medium text-gray-400">No data yet</p>
            <p className="mt-1 text-[11px] text-gray-300">Upload a CSV to see your data here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {TABLE_COLS.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="whitespace-nowrap px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {previewRows.map((row, idx) => (
                  <tr key={`${row.donor_id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-[11px] text-gray-400">
                      {row.donor_id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium text-brand-text">
                      {row.donor_name || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-[12px] text-gray-500">
                      {row.segment || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-[12px] text-gray-500">
                      {row.gift_date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-[12px] font-medium text-brand-text">
                      {formatCurrency(row.gift_amount)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      {row._status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600">
                          <span className="h-1 w-1 rounded-full bg-green-500" />
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
                          <span className="h-1 w-1 rounded-full bg-red-500" />
                          Error
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {uploadResult.rowCount > 8 && (
              <p className="border-t border-gray-50 px-4 py-2.5 text-[11px] text-gray-400">
                Showing {previewRows.length} of {uploadResult.totalRows} rows
              </p>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        aria-hidden="true"
      />
    </div>
  );
}
