'use client';

import {
  CartesianGrid,
  Line,
  LineChart as ReChartsLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchAdminLoginStatsAction } from '../actions';
import { AdminLoginStatPoint } from '../types';
import { useAdminStatsChart } from '../hooks/useAdminStatsChart';
import StatsChartCard from './StatsChartCard';

export default function LoginStatsChart() {
  const { period, setPeriod, data, isLoading, error } = useAdminStatsChart<AdminLoginStatPoint>(
    fetchAdminLoginStatsAction,
  );

  return (
    <StatsChartCard
      title="로그인 수"
      period={period}
      onPeriodChange={setPeriod}
      isLoading={isLoading}
      error={error}
      isEmpty={data.length === 0}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsLine data={data}>
          {/* 격자 - 세로선 없이 가로선만 (Figma 목업과 동일) */}
          <CartesianGrid strokeDasharray="1 3" vertical={false} stroke="#E5E7EB" />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip />

          <Line
            dataKey="count"
            name="로그인 수"
            type="monotone"
            stroke="#FF5E5E"
            strokeWidth={2}
            dot={{ r: 4, fill: '#FFFFFF', stroke: '#FF5E5E', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </ReChartsLine>
      </ResponsiveContainer>
    </StatsChartCard>
  );
}
