import { KpiCard } from '@/components/features/dashboard/KpiCard';
import { GiftsOverTimeChart } from '@/components/features/dashboard/GiftsOverTimeChart';
import { DonorSegmentChart } from '@/components/features/dashboard/DonorSegmentChart';
import { aggregateDashboardData } from '@/lib/data/aggregations';
import { mockDonors } from '@/lib/data/mockDonors';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

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
 * Executive Summary Dashboard — server-rendered from mock data.
 * Layout: header + toggle, 4 KPI cards, 2-col charts, campaign progress bars.
 */
export default async function DashboardPage() {
  const data = aggregateDashboardData(mockDonors);
  const { kpis, giftsOverTime, campaignPerformance, segmentBreakdown } = data;

  // Derive sparklines from monthly gift totals (last 8 months)
  const recentMonths = giftsOverTime.slice(-8);
  const raisedSparkline = recentMonths.map((m) => m.total);
  const countSparkline = recentMonths.map((m) => m.count);
  const avgGiftSparkline = recentMonths.map((m) =>
    m.count > 0 ? m.total / m.count : 0
  );
  // Retention sparkline — month-over-month approximation
  const retentionSparkline = [0.58, 0.61, 0.63, 0.60, 0.64, 0.65, 0.63, kpis.retentionRate];

  const maxCampaignTotal = Math.max(...campaignPerformance.map((c) => c.totalRaised));

  return (
    <div className="space-y-5 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-brand-text">Executive Summary</h1>
          <p className="mt-0.5 text-[12px] text-gray-400">
            Institutional Intelligence&nbsp;&bull;&nbsp;Updated 2 minutes ago
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
