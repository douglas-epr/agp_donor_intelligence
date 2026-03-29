import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/lib/constants';

const DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true';

/**
 * Protected dashboard layout.
 * Redirects unauthenticated users to the login page.
 * When NEXT_PUBLIC_DEV_BYPASS_AUTH=true, skips auth for local mock-data development.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!DEV_BYPASS) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect(ROUTES.LOGIN);
    }
  }

  return <AppShell>{children}</AppShell>;
}
