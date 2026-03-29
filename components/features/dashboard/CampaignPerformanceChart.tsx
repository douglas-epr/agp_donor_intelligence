'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '@/components/ui/Card';
import { formatCurrency, truncate } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/constants';
import type { CampaignPerf } from '@/lib/data/aggregations';

interface CampaignPerformanceChartProps {
  data: CampaignPerf[];
}

/**
 * Bar chart comparing total raised and average gift across campaigns.
 *
 * @param {CampaignPerformanceChartProps} props
 */
export function CampaignPerformanceChart({ data }: CampaignPerformanceChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    campaignShort: truncate(d.campaign, 18),
  }));

  return (
    <Card>
      <CardHeader
        title="Campaign Performance"
        subtitle="Total raised per campaign"
      />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="campaignShort"
            tick={{ fontSize: 10, fill: '#6B7280' }}
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
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'totalRaised' ? 'Total Raised' : 'Avg Gift',
            ]}
            labelStyle={{ color: '#2A2E35', fontWeight: 600 }}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
            }}
          />
          <Legend
            formatter={(value) => (value === 'totalRaised' ? 'Total Raised' : 'Avg Gift')}
            iconSize={10}
            wrapperStyle={{ fontSize: '11px' }}
          />
          <Bar dataKey="totalRaised" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="averageGift" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
