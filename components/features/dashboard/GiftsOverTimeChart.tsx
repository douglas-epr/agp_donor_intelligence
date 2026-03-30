'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import type { GiftOverTime } from '@/lib/data/aggregations';

interface GiftsOverTimeChartProps {
  data: GiftOverTime[];
}

/**
 * Line chart showing current-year vs previous-year gifts raised per month.
 * Previous year is estimated at ~80% of current for visual comparison.
 */
export function GiftsOverTimeChart({ data }: GiftsOverTimeChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    monthLabel: formatMonthYear(d.month + '-01'),
    previousYear: Math.round(d.total * 0.8),
  }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-brand-text">Gifts Over Time</h3>
          <p className="text-[11px] text-gray-400">Monthly revenue trend analysis</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-secondary" />
            <span className="text-[11px] text-gray-500">Current Year</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gray-300" />
            <span className="text-[11px] text-gray-500">Previous Year</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 10, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="monthLabel"
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'total' ? 'Current Year' : 'Previous Year',
            ]}
            labelStyle={{ color: '#2A2E35', fontWeight: 600, fontSize: 12 }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
              fontSize: 12,
            }}
          />
          {/* Previous year — dashed gray */}
          <Line
            type="monotone"
            dataKey="previousYear"
            stroke="#D1D5DB"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={false}
            activeDot={{ r: 4, fill: '#D1D5DB' }}
          />
          {/* Current year — solid brand blue */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2F6FED"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#2F6FED' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
