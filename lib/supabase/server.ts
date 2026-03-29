import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

/**
 * Creates a Supabase client for use in Server Components and API routes.
 * Reads session cookies to authenticate the request.
 *
 * RULES.MD Rule 0: This client uses the anon key and relies on RLS.
 * Use createAdminClient() (service role) only for trusted server operations.
 *
 * @returns Supabase server client.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Partial<ResponseCookie> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can throw in Server Components (read-only context)
            // This is expected — middleware handles session refresh
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase admin client using the service role key.
 *
 * RULES.MD Rule 0: ONLY call this from app/api/* route handlers
 * after validating the user session. NEVER use in components or pages.
 *
 * @returns Supabase admin client with elevated privileges.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
