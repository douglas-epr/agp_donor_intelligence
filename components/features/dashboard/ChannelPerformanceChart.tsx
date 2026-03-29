'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card, CardHeader } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/constants';
import type { ChannelPerf } from '@/lib/data/aggregations';

interface ChannelPerformanceChartProps {
  data: ChannelPerf[];
}

/**
 * Horizontal bar chart showing total revenue by acquisition channel.
 *
 * @param {ChannelPerformanceChartProps} props
 */
export function ChannelPerformanceChart({ data }: ChannelPerformanceChartProps) {
  return (
    <Card>
      <CardHeader
        title="Channel Performance"
        subtitle="Revenue by acquisition channel"
      />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="channel"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={60}
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
          <Bar dataKey="totalRaised" fill={CHART_COLORS[2]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
