'use client';

import { useEffect, useState } from 'react';
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
import { AdminAiUsageStatPoint, LoginStatsPeriod } from '../types';

const PERIOD_OPTIONS: { value: LoginStatsPeriod; label: string }[] = [
  { value: 'daily', label: '요일' },
  { value: 'hourly', label: '시간대' },
];

const SERIES = [
  { dataKey: 'resume_evaluate', name: '이력서 분석', color: '#FF5E5E' },
  { dataKey: 'cover_letter_review', name: '자기소개서 분석', color: '#A8D014' },
  { dataKey: 'job_analysis', name: '채용공고 분석 및 강의 추천', color: '#5B8DEE' },
] as const;

export default function AiUsageChart() {
  const [period, setPeriod] = useState<LoginStatsPeriod>('hourly');
  const [data, setData] = useState<AdminAiUsageStatPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');
    fetchAdminAiUsageStatsAction(period).then((result) => {
      if (!active) return;
      if (result.success) {
        setData(result.data);
      } else {
        setData([]);
        setError(result.message);
      }
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [period]);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[16px] font-bold text-[#1E2125]">AI 기능 사용량</h2>
        <div className="flex items-center gap-1.5 shrink-0">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 rounded-full text-[12.5px] font-semibold transition-colors cursor-pointer ${
                period === opt.value
                  ? 'bg-[#1E2125] text-white'
                  : 'bg-white text-[#6A7282] border border-[#D1D5DB] hover:bg-[#F9FAFB]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        {SERIES.map((s) => (
          <div key={s.dataKey} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[12px] text-[#6A7282]">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="h-72">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-[13px] text-[#6A7282]">
            불러오는 중...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-[13px] text-[#6A7282]">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[13px] text-[#6A7282]">
            데이터가 없습니다.
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
