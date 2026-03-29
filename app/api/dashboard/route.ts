import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mockDonors } from '@/lib/data/mockDonors';
import { aggregateDashboardData } from '@/lib/data/aggregations';

/**
 * GET /api/dashboard
 *
 * Returns aggregated KPIs and chart data for the executive dashboard.
 * MVP: uses mockDonors. Swap for a Supabase query filtered by user_id when DB is connected.
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
    const data = aggregateDashboardData(mockDonors);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('GET /api/dashboard error:', err);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to load dashboard data.' } },
      { status: 500 }
    );
  }
}
