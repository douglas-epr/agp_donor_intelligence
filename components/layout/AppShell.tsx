import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Full dashboard shell — TopBar + Sidebar + main content area.
 * Used as the layout wrapper for all protected dashboard pages.
 *
 * @param {AppShellProps} props
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-brand-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
