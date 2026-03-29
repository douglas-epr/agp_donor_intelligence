import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth
 *
 * Handles sign-out action from the server side.
 * The sign-in flow is handled client-side via Supabase Auth SDK.
 *
 * Body: { action: 'logout' }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === 'logout') {
      const supabase = await createClient();
      await supabase.auth.signOut();
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { error: { code: 'INVALID_ACTION', message: 'Unknown auth action.' } },
      { status: 400 }
    );
  } catch (err) {
    console.error('POST /api/auth error:', err);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Authentication failed.' } },
      { status: 500 }
    );
  }
}
