'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { formatNumber } from '@/lib/utils';
import type { SegmentBreakdown } from '@/lib/data/aggregations';

interface DonorSegmentChartProps {
  data: SegmentBreakdown[];
}

// Segment-specific colors matching the reference design
const SEGMENT_COLORS = ['#2F6FED', '#1F3E77', '#9EDC4B', '#F59E0B', '#EC4899', '#8B5CF6'];

/**
 * Donut chart showing donor count breakdown by segment.
 * Shows total in center and percentage per segment in legend below.
 */
export function DonorSegmentChart({ data }: DonorSegmentChartProps) {
  const total = data.reduce((sum, d) => sum + d.donorCount, 0);
  const totalLabel = total >= 1000 ? `${(total / 1000).toFixed(1)}k` : String(total);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
      <div className="mb-1">
        <h3 className="text-[14px] font-bold text-brand-text">Segment Breakdown</h3>
        <p className="text-[11px] text-gray-400">Donor distribution by level</p>
      </div>

      {/* Donut chart */}
      <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="donorCount"
              nameKey="segment"
              cx="50%"
              cy="50%"
              outerRadius={85}
              innerRadius={52}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${formatNumber(value)} donors`,
                name,
              ]}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label — absolutely positioned over the donut hole */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-400"
          >
            TOTAL
          </span>
          <span className="text-[22px] font-extrabold leading-tight text-brand-text">
            {totalLabel}
          </span>
        </div>
      </div>

      {/* Legend with percentages */}
      <div className="mt-3 space-y-2">
        {data.map((item, i) => {
          const pct = total > 0 ? Math.round((item.donorCount / total) * 100) : 0;
          return (
            <div key={item.segment} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                />
                <span className="text-[12px] text-gray-600">{item.segment}</span>
              </div>
              <span className="text-[12px] font-semibold text-brand-text">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
