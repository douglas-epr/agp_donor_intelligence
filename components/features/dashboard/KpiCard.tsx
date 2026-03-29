import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/ui/Sparkline';

interface KpiCardProps {
  /** Card label (e.g., "Total Raised"). */
  label: string;
  /** Formatted value string (e.g., "$1.2M"). */
  value: string;
  /** Change label (e.g., "+12.4%"). */
  change?: string;
  /** Whether the change is positive. */
  changePositive?: boolean;
  /** Change subtitle (e.g., "Stable"). */
  changeSub?: string;
  /** Sparkline data points (6–8 values). */
  sparkline?: number[];
  className?: string;
}

/**
 * Executive KPI card with sparkline and trend indicator.
 * Matches the institutional dashboard design reference.
 */
export function KpiCard({
  label,
  value,
  change,
  changePositive = true,
  changeSub,
  sparkline,
  className,
}: KpiCardProps) {
  const sparkColor = changePositive ? '#9EDC4B' : '#EF4444';

  return (
    <div className={cn('rounded-xl border border-gray-100 bg-white p-5 shadow-card', className)}>
      <p className="text-[12px] font-medium text-gray-400">{label}</p>
      <p className="kpi-value mt-1.5 text-[28px]">{value}</p>

      <div className="mt-3 flex items-end justify-between">
        {/* Trend indicator */}
        <div className="flex items-center gap-1">
          {change && (
            <>
              {changePositive ? (
                <svg className="h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
              ) : (
                <svg className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              )}
              <span
                className={cn(
                  'text-[11px] font-semibold',
                  changePositive ? 'text-green-600' : 'text-red-500'
                )}
              >
                {change}
              </span>
            </>
          )}
          {changeSub && !change && (
            <span className="text-[11px] text-gray-400">— {changeSub}</span>
          )}
        </div>

        {/* Sparkline */}
        {sparkline && (
          <Sparkline data={sparkline} color={sparkColor} width={80} height={28} />
        )}
      </div>
    </div>
  );
}
