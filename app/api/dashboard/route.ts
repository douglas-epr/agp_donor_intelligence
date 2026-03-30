import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aggregateDashboardData } from '@/lib/data/aggregations';
import type { DonorGift } from '@/lib/data/mockDonors';

/**
 * GET /api/dashboard
 *
 * Returns aggregated KPIs and chart data for the executive dashboard.
 * Queries donor_gifts filtered by the authenticated user's ID.
 * Defense-in-depth: .eq('user_id', user.id) in addition to RLS (RULES.MD Rule 10).
 *
 * RULES.MD Rule 0: user_id from session only — never from request body.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
      { status: 401 }
    );
  }

  try {
    const { data: gifts, error } = await supabase
      .from('donor_gifts')
      .select('donor_id, donor_name, segment, gift_date, gift_amount, campaign, channel, region')
      .eq('user_id', user.id)
      .order('gift_date', { ascending: true });

    if (error) {
      console.error('GET /api/dashboard db error:', error);
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Failed to load dashboard data.' } },
        { status: 500 }
      );
    }

    const donorGifts: DonorGift[] = (gifts ?? []).map((row) => ({
      donor_id: row.donor_id,
      donor_name: row.donor_name ?? '',
      segment: row.segment ?? '',
      gift_date: row.gift_date,
      gift_amount: Number(row.gift_amount),
      campaign: row.campaign ?? '',
      channel: row.channel ?? '',
      region: row.region ?? '',
    }));

    const data = aggregateDashboardData(donorGifts);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('GET /api/dashboard error:', err);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to load dashboard data.' } },
      { status: 500 }
    );
  }
}
