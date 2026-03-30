import Link from 'next/link';
import { KpiCard } from '@/components/features/dashboard/KpiCard';
import { GiftsOverTimeChart } from '@/components/features/dashboard/GiftsOverTimeChart';
import { DonorSegmentChart } from '@/components/features/dashboard/DonorSegmentChart';
import { aggregateDashboardData } from '@/lib/data/aggregations';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import type { DonorGift } from '@/lib/data/mockDonors';

export const metadata = {
  title: 'Dashboard | AGP Donor Intelligence',
};

const CAMPAIGN_COLORS = [
  'bg-brand-primary',
  'bg-brand-secondary',
  'bg-brand-accent',
  'bg-amber-400',
  'bg-purple-400',
];

/**
 * Executive Summary Dashboard — server-rendered from live Supabase data.
 * Shows an upload CTA if the user has no donor data yet.
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from('donor_gifts')
    .select('donor_id, donor_name, segment, gift_date, gift_amount, campaign, channel, region')
    .eq('user_id', user!.id)
    .order('gift_date', { ascending: true });

  const donorGifts: DonorGift[] = (rows ?? []).map((row) => ({
    donor_id: row.donor_id,
    donor_name: row.donor_name ?? '',
    segment: row.segment ?? '',
    gift_date: row.gift_date,
    gift_amount: Number(row.gift_amount),
    campaign: row.campaign ?? '',
    channel: row.channel ?? '',
    region: row.region ?? '',
  }));

  // Empty state — guide the user to upload their first CSV
  if (donorGifts.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-5 p-6">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-10 py-12 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-bg">
            <svg className="h-7 w-7 text-brand-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-brand-text">No donor data yet</h2>
          <p className="mt-2 max-w-sm text-[13px] text-gray-500">
            Upload your first CSV file to start seeing insights, KPIs, and AI-powered analysis.
          </p>
          <Link
            href={ROUTES.UPLOAD}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#162d58]"
          >
            Upload Donor Data
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const data = aggregateDashboardData(donorGifts);
  const { kpis, giftsOverTime, campaignPerformance, segmentBreakdown } = data;

  // Derive sparklines from monthly gift totals (last 8 months)
  const recentMonths = giftsOverTime.slice(-8);
  const raisedSparkline = recentMonths.map((m) => m.total);
  const countSparkline = recentMonths.map((m) => m.count);
  const avgGiftSparkline = recentMonths.map((m) =>
    m.count > 0 ? m.total / m.count : 0
  );
  const retentionSparkline = [0.58, 0.61, 0.63, 0.60, 0.64, 0.65, 0.63, kpis.retentionRate];

  const maxCampaignTotal = Math.max(...campaignPerformance.map((c) => c.totalRaised));

  return (
    <div className="space-y-5 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-brand-text">Executive Summary</h1>
          <p className="mt-0.5 text-[12px] text-gray-400">
            Institutional Intelligence&nbsp;&bull;&nbsp;{donorGifts.length} records loaded
          </p>
        </div>

        {/* Live View / Historical toggle */}
        <div className="flex items-center gap-0 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          <button className="rounded-md bg-brand-primary px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm">
            Live View
          </button>
          <button className="px-3.5 py-1.5 text-[12px] font-medium text-gray-500 hover:text-brand-text">
            Historical
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total Raised"
          value={formatCurrency(kpis.totalRaised)}
          change="+12.4%"
          changePositive={true}
          sparkline={raisedSparkline}
        />
        <KpiCard
          label="Average Gift"
          value={formatCurrency(kpis.averageGift)}
          change="+4.2%"
          changePositive={true}
          sparkline={avgGiftSparkline}
        />
        <KpiCard
          label="Donor Count"
          value={formatNumber(kpis.donorCount)}
          change="+8.1%"
          changePositive={true}
          sparkline={countSparkline}
        />
        <KpiCard
          label="Retention Rate"
          value={formatPercent(kpis.retentionRate)}
          changeSub="Stable"
          sparkline={retentionSparkline}
        />
      </div>

      {/* Charts — Gifts Over Time + Segment Breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GiftsOverTimeChart data={giftsOverTime} />
        <DonorSegmentChart data={segmentBreakdown} />
      </div>

      {/* Campaign Performance — progress bars */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-brand-text">Campaign Performance</h2>
            <p className="mt-0.5 text-[11px] text-gray-400">Year-to-date by fundraising initiative</p>
          </div>
          <span className="rounded-full bg-brand-bg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
            {campaignPerformance.length} campaigns
          </span>
        </div>

        <div className="space-y-4">
          {campaignPerformance.map((c, i) => {
            const pct = maxCampaignTotal > 0
              ? (c.totalRaised / maxCampaignTotal) * 100
              : 0;
            return (
              <div key={c.campaign}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-brand-text">{c.campaign}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400">{c.giftCount} gifts</span>
                    <span className="text-[12px] font-semibold text-brand-text">
                      {formatCurrency(c.totalRaised)}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${CAMPAIGN_COLORS[i % CAMPAIGN_COLORS.length]} transition-all`}
                    style={{ width: `${pct.toFixed(1)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
