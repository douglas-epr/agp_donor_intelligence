import type { DonorGift } from '@/lib/data/mockDonors';

/**
 * Structured dataset context passed to the AI model.
 * Contains aggregated summaries — never raw PII rows.
 */
export interface DonorDataContext {
  totalGifts: number;
  totalRaised: number;
  donorCount: number;
  dateRange: { from: string; to: string };
  segments: { name: string; totalRaised: number; giftCount: number }[];
  campaigns: { name: string; totalRaised: number; averageGift: number; giftCount: number }[];
  channels: { name: string; totalRaised: number; giftCount: number }[];
  regions: { name: string; totalRaised: number; giftCount: number }[];
  topDonors: { donorId: string; totalGiven: number; giftCount: number }[];
}

/**
 * Builds a structured, anonymized context summary from donor gift data
 * to pass to the AI model alongside the user's question.
 *
 * This function ensures:
 * - No raw PII (donor names) is sent to the LLM
 * - The context is compact enough to fit in a prompt
 * - All data is grounded in the actual uploaded dataset
 *
 * @param {DonorGift[]} gifts - The full donor gift dataset.
 * @returns {DonorDataContext} Structured summary for AI context.
 */
export function buildDonorContext(gifts: DonorGift[]): DonorDataContext {
  if (gifts.length === 0) {
    return {
      totalGifts: 0,
      totalRaised: 0,
      donorCount: 0,
      dateRange: { from: '', to: '' },
      segments: [],
      campaigns: [],
      channels: [],
      regions: [],
      topDonors: [],
    };
  }

  const totalRaised = gifts.reduce((sum, g) => sum + g.gift_amount, 0);
  const donorIds = new Set(gifts.map((g) => g.donor_id));
  const sortedDates = gifts.map((g) => g.gift_date).sort();

  // Segments
  const segmentMap = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const key = gift.segment || 'General';
    const s = segmentMap.get(key) ?? { total: 0, count: 0 };
    segmentMap.set(key, { total: s.total + gift.gift_amount, count: s.count + 1 });
  }
  const segments = [...segmentMap.entries()]
    .map(([name, v]) => ({ name, totalRaised: v.total, giftCount: v.count }))
    .sort((a, b) => b.totalRaised - a.totalRaised);

  // Campaigns
  const campaignMap = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const key = gift.campaign || 'Unknown';
    const c = campaignMap.get(key) ?? { total: 0, count: 0 };
    campaignMap.set(key, { total: c.total + gift.gift_amount, count: c.count + 1 });
  }
  const campaigns = [...campaignMap.entries()]
    .map(([name, v]) => ({
      name,
      totalRaised: v.total,
      averageGift: v.total / v.count,
      giftCount: v.count,
    }))
    .sort((a, b) => b.totalRaised - a.totalRaised);

  // Channels
  const channelMap = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const key = gift.channel || 'Unknown';
    const c = channelMap.get(key) ?? { total: 0, count: 0 };
    channelMap.set(key, { total: c.total + gift.gift_amount, count: c.count + 1 });
  }
  const channels = [...channelMap.entries()]
    .map(([name, v]) => ({ name, totalRaised: v.total, giftCount: v.count }))
    .sort((a, b) => b.totalRaised - a.totalRaised);

  // Regions
  const regionMap = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const key = gift.region || 'Unknown';
    const r = regionMap.get(key) ?? { total: 0, count: 0 };
    regionMap.set(key, { total: r.total + gift.gift_amount, count: r.count + 1 });
  }
  const regions = [...regionMap.entries()]
    .map(([name, v]) => ({ name, totalRaised: v.total, giftCount: v.count }))
    .sort((a, b) => b.totalRaised - a.totalRaised);

  // Top donors (anonymized — donor_id only, no names)
  const donorTotals = new Map<string, { total: number; count: number }>();
  for (const gift of gifts) {
    const d = donorTotals.get(gift.donor_id) ?? { total: 0, count: 0 };
    donorTotals.set(gift.donor_id, { total: d.total + gift.gift_amount, count: d.count + 1 });
  }
  const topDonors = [...donorTotals.entries()]
    .map(([donorId, v]) => ({ donorId, totalGiven: v.total, giftCount: v.count }))
    .sort((a, b) => b.totalGiven - a.totalGiven)
    .slice(0, 10);

  return {
    totalGifts: gifts.length,
    totalRaised,
    donorCount: donorIds.size,
    dateRange: { from: sortedDates[0], to: sortedDates[sortedDates.length - 1] },
    segments,
    campaigns,
    channels,
    regions,
    topDonors,
  };
}

/**
 * Builds the system prompt sent to Claude for donor intelligence queries.
 *
 * @param {DonorDataContext} context - Structured dataset context.
 * @returns {string} System prompt string.
 */
export function buildSystemPrompt(context: DonorDataContext): string {
  return `You are an expert nonprofit fundraising analyst assistant for AGP Donor Intelligence.

You have access to a structured summary of the user's uploaded donor gift dataset. Answer the user's question using ONLY the data provided below. Do not hallucinate or make up data. If you cannot answer from the provided context, say so clearly.

When presenting numbers, format currency as USD (e.g., $12,500) and percentages clearly.
Keep responses concise and executive-ready — 2 to 4 short paragraphs maximum.
Use bullet points for lists.

--- DATASET SUMMARY ---
Total gifts: ${context.totalGifts}
Total raised: $${context.totalRaised.toLocaleString('en-US', { maximumFractionDigits: 0 })}
Unique donors: ${context.donorCount}
Date range: ${context.dateRange.from} to ${context.dateRange.to}

Segments (by total raised):
${context.segments.map((s) => `  • ${s.name}: $${s.totalRaised.toLocaleString('en-US', { maximumFractionDigits: 0 })} from ${s.giftCount} gifts`).join('\n')}

Campaigns (by total raised):
${context.campaigns.map((c) => `  • ${c.name}: $${c.totalRaised.toLocaleString('en-US', { maximumFractionDigits: 0 })} total, avg gift $${c.averageGift.toLocaleString('en-US', { maximumFractionDigits: 0 })} (${c.giftCount} gifts)`).join('\n')}

Channels (by total raised):
${context.channels.map((ch) => `  • ${ch.name}: $${ch.totalRaised.toLocaleString('en-US', { maximumFractionDigits: 0 })} from ${ch.giftCount} gifts`).join('\n')}

Regions (by total raised):
${context.regions.map((r) => `  • ${r.name}: $${r.totalRaised.toLocaleString('en-US', { maximumFractionDigits: 0 })} from ${r.giftCount} gifts`).join('\n')}
--- END DATASET SUMMARY ---`;
}
