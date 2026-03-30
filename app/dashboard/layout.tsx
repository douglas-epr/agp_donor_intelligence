import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/lib/constants';

/**
 * Protected dashboard layout.
 * Always validates the Supabase session server-side.
 * Unauthenticated users are redirected to /login by both this layout
 * and the middleware (defence in depth).
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return <AppShell>{children}</AppShell>;
}
