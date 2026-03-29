'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { CHART_COLORS } from '@/lib/constants';
import type { SegmentBreakdown } from '@/lib/data/aggregations';

interface DonorSegmentChartProps {
  data: SegmentBreakdown[];
}

/**
 * Pie chart showing revenue breakdown by donor segment.
 *
 * @param {DonorSegmentChartProps} props
 */
export function DonorSegmentChart({ data }: DonorSegmentChartProps) {
  return (
    <Card>
      <CardHeader
        title="Donor Segment Breakdown"
        subtitle="Revenue by segment"
      />
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="totalRaised"
            nameKey="segment"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={45}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name,
            ]}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
