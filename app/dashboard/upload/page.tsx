import { CsvUploadZone } from '@/components/features/csv/CsvUploadZone';

export const metadata = {
  title: 'Data Vault | AGP Donor Intelligence',
};

/**
 * CSV upload page — two-column layout: left (drop zone + validation), right (data preview).
 */
export default function UploadPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-brand-text">Data Vault</h1>
        <p className="mt-0.5 text-[12px] text-gray-400">
          Upload a CSV export from your CRM to populate the dashboard. Your data is stored privately.
        </p>
      </div>

      <CsvUploadZone />
    </div>
  );
}
