import { QueryInput } from '@/components/features/ai/QueryInput';

export const metadata = {
  title: 'AI Data Explorer | AGP Donor Intelligence',
};

/**
 * AI Data Explorer page — natural language queries grounded in uploaded donor data.
 */
export default function QueryPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-brand-text">AI Data Explorer</h1>
        <p className="mt-0.5 text-[12px] text-gray-400">
          Ask questions about your donor data in plain English. Responses are grounded in your dataset only.
        </p>
      </div>

      <QueryInput />
    </div>
  );
}
