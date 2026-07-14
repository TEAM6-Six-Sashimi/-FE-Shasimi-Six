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
import { fetchAdminAiUsageStatsAction } from '../actions';
import { AdminAiUsageStatPoint } from '../types';
import { useAdminStatsChart } from '../hooks/useAdminStatsChart';
import StatsChartCard from './StatsChartCard';

const SERIES = [
  { dataKey: 'resume_evaluate', name: '이력서 분석', color: '#FF5E5E' },
  { dataKey: 'cover_letter_review', name: '자기소개서 분석', color: '#A8D014' },
  { dataKey: 'job_analysis', name: '채용공고 분석 및 강의 추천', color: '#5B8DEE' },
] as const;

export default function AiUsageChart() {
  const { period, setPeriod, data, isLoading, error } = useAdminStatsChart<AdminAiUsageStatPoint>(
    fetchAdminAiUsageStatsAction,
  );

  const legend = (
    <>
      {SERIES.map((s) => (
        <div key={s.dataKey} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: s.color }}
          />
          <span className="text-[12px] text-[#6A7282]">{s.name}</span>
        </div>
      ))}
    </>
  );

  return (
    <StatsChartCard
      title="AI 기능 사용량"
      period={period}
      onPeriodChange={setPeriod}
      isLoading={isLoading}
      error={error}
      isEmpty={data.length === 0}
      legend={legend}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ReChartsLine data={data}>
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

          {/* SVG는 나중에 그려진 요소가 위로 오므로, 코랄이 맨 위(마지막)로 오도록 역순으로 렌더링 */}
          {[...SERIES].reverse().map((s) => (
            <Line
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.name}
              type="monotone"
              stroke={s.color}
              strokeWidth={2}
              dot={{ r: 4, fill: '#FFFFFF', stroke: s.color, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </ReChartsLine>
      </ResponsiveContainer>
    </StatsChartCard>
  );
}
