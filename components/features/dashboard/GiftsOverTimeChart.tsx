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
import { Card, CardHeader } from '@/components/ui/Card';
import { formatCurrency, formatMonthYear } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/constants';
import type { GiftOverTime } from '@/lib/data/aggregations';

interface GiftsOverTimeChartProps {
  data: GiftOverTime[];
}

/**
 * Line chart showing total gifts raised per month over time.
 *
 * @param {GiftsOverTimeChartProps} props
 */
export function GiftsOverTimeChart({ data }: GiftsOverTimeChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    monthLabel: formatMonthYear(d.month + '-01'),
  }));

  return (
    <Card>
      <CardHeader
        title="Gifts Over Time"
        subtitle="Total raised by month"
      />
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="monthLabel"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Total Raised']}
            labelStyle={{ color: '#2A2E35', fontWeight: 600 }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke={CHART_COLORS[0]}
            strokeWidth={2.5}
            dot={{ fill: CHART_COLORS[0], r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
