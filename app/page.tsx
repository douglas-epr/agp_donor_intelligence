import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants';

/**
 * Root page — redirects authenticated users to the dashboard,
 * unauthenticated users to the login page.
 */
export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(ROUTES.DASHBOARD);
  } else {
    redirect(ROUTES.LOGIN);
  }
}
