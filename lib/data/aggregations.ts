import type { DonorGift } from '@/lib/data/mockDonors';

export interface KpiBlock {
  totalRaised: number;
  averageGift: number;
  donorCount: number;
  retentionRate: number; // 0–1
}

export interface GiftOverTime {
  month: string; // e.g., "2024-03"
  total: number;
  count: number;
}

export interface CampaignPerf {
  campaign: string;
  totalRaised: number;
  averageGift: number;
  giftCount: number;
}

export interface SegmentBreakdown {
  segment: string;
  totalRaised: number;
  donorCount: number;
}

export interface ChannelPerf {
  channel: string;
  totalRaised: number;
  giftCount: number;
}

export interface DashboardData {
  kpis: KpiBlock;
  giftsOverTime: GiftOverTime[];
  campaignPerformance: CampaignPerf[];
  segmentBreakdown: SegmentBreakdown[];
  channelPerformance: ChannelPerf[];
}

/**
 * Computes all dashboard KPIs and chart data from a donor gift array.
 * Used by the dashboard page (server component) and the API route.
 */
export function aggregateDashboardData(gifts: DonorGift[]): DashboardData {
  const totalRaised = gifts.reduce((sum, g) => sum + g.gift_amount, 0);
  const averageGift = gifts.length > 0 ? totalRaised / gifts.length : 0;

  const allDonorIds = new Set(gifts.map((g) => g.donor_id));
  const donorCount = allDonorIds.size;

  // Retention: donors who appear in more than one calendar month
  const donorMonths = new Map<string, Set<string>>();
  for (const gift of gifts) {
    const month = gift.gift_date.slice(0, 7);
    if (!donorMonths.has(gift.donor_id)) donorMonths.set(gift.donor_id, new Set());
    donorMonths.get(gift.donor_id)!.add(month);
  }
  const repeatDonors = [...donorMonths.values()].filter((m) => m.size > 1).length;
  const retentionRate = donorCount > 0 ? repeatDonors / donorCount : 0;

  // Gifts over time — grouped by YYYY-MM
  const byMonth = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const month = gift.gift_date.slice(0, 7);
    const existing = byMonth.get(month) ?? { total: 0, count: 0 };
    byMonth.set(month, { total: existing.total + gift.gift_amount, count: existing.count + 1 });
  }
  const giftsOverTime: GiftOverTime[] = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, val]) => ({ month, ...val }));

  // Campaign performance
  const byCampaign = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const key = gift.campaign || 'Unknown';
    const existing = byCampaign.get(key) ?? { total: 0, count: 0 };
    byCampaign.set(key, { total: existing.total + gift.gift_amount, count: existing.count + 1 });
  }
  const campaignPerformance: CampaignPerf[] = [...byCampaign.entries()]
    .map(([campaign, val]) => ({
      campaign,
      totalRaised: val.total,
      averageGift: val.total / val.count,
      giftCount: val.count,
    }))
    .sort((a, b) => b.totalRaised - a.totalRaised);

  // Segment breakdown
  const bySegment = new Map<string, { total: number; donors: Set<string> }>();
  for (const gift of gifts) {
    const key = gift.segment || 'General';
    if (!bySegment.has(key)) bySegment.set(key, { total: 0, donors: new Set() });
    const seg = bySegment.get(key)!;
    seg.total += gift.gift_amount;
    seg.donors.add(gift.donor_id);
  }
  const segmentBreakdown: SegmentBreakdown[] = [...bySegment.entries()]
    .map(([segment, val]) => ({
      segment,
      totalRaised: val.total,
      donorCount: val.donors.size,
    }))
    .sort((a, b) => b.totalRaised - a.totalRaised);

  // Channel performance
  const byChannel = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const key = gift.channel || 'Unknown';
    const existing = byChannel.get(key) ?? { total: 0, count: 0 };
    byChannel.set(key, { total: existing.total + gift.gift_amount, count: existing.count + 1 });
  }
  const channelPerformance: ChannelPerf[] = [...byChannel.entries()]
    .map(([channel, val]) => ({
      channel,
      totalRaised: val.total,
      giftCount: val.count,
    }))
    .sort((a, b) => b.totalRaised - a.totalRaised);

  return {
    kpis: { totalRaised, averageGift, donorCount, retentionRate },
    giftsOverTime,
    campaignPerformance,
    segmentBreakdown,
    channelPerformance,
  };
}
