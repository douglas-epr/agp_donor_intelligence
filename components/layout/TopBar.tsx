'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD },
  { label: 'Upload', href: ROUTES.UPLOAD },
  { label: 'AI Explorer', href: ROUTES.QUERY },
  { label: 'Reports', href: '#', disabled: true },
] as const;

/**
 * Top navigation bar with centered tab navigation, matching the design reference.
 */
export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push(ROUTES.LOGIN);
    router.refresh();
  }

  function isActive(href: string) {
    if (href === ROUTES.DASHBOARD) return pathname === ROUTES.DASHBOARD;
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center px-6">
        {/* Brand — left */}
        <Link href={ROUTES.DASHBOARD} className="flex shrink-0 items-center gap-2 mr-8">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <rect x="1" y="10" width="4" height="11" rx="1" fill="#1F3E77" />
            <rect x="7" y="5" width="4" height="16" rx="1" fill="#1F3E77" />
            <rect x="13" y="1" width="4" height="20" rx="1" fill="#9EDC4B" />
            <rect x="19" y="7" width="2.5" height="14" rx="1" fill="#2F6FED" />
          </svg>
          <span className="text-[13px] font-bold uppercase tracking-[0.07em] text-brand-primary">
            AGP Donor Intelligence
          </span>
        </Link>

        {/* Center nav tabs */}
        <nav className="flex flex-1 items-center justify-center gap-0.5" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'relative px-4 py-1.5 text-[13px] font-medium transition-colors',
                  'disabled' in item && item.disabled && 'pointer-events-none opacity-40',
                  active
                    ? 'text-brand-primary'
                    : 'text-gray-500 hover:text-brand-primary'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-brand-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Bell */}
          <button
            aria-label="Notifications"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>

          {/* Settings */}
          <button
            aria-label="Settings"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>

          {/* New Query button */}
          <Link
            href={ROUTES.QUERY}
            className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#162d58]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Query
          </Link>

          {/* Avatar */}
          <button
            onClick={handleSignOut}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-[12px] font-bold text-white hover:bg-[#162d58] transition-colors"
            aria-label="Sign out"
            title="Click to sign out"
          >
            A
          </button>
        </div>
      </div>
    </header>
  );
}
