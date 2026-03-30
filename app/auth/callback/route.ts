import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /auth/callback
 *
 * Handles the OAuth / magic-link / email-confirmation redirect from Supabase.
 * Supabase sends the user here with a one-time `code` in the query string.
 * We exchange it for a session, then redirect to the dashboard.
 *
 * This route is excluded from the middleware matcher so the session exchange
 * can complete before any session checks run.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl);
    }

    console.error('Auth callback exchange error:', error.message);
  }

  // Exchange failed or no code — send to login with an error hint
  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('error', 'auth_callback_failed');
  return NextResponse.redirect(loginUrl);
}
