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
import { fetchAdminLoginStatsAction } from '../actions';
import { AdminLoginStatPoint, LoginStatsPeriod } from '../types';

const PERIOD_OPTIONS: { value: LoginStatsPeriod; label: string }[] = [
  { value: 'daily', label: '요일' },
  { value: 'hourly', label: '시간대' },
];

export default function LoginStatsChart() {
  const [period, setPeriod] = useState<LoginStatsPeriod>('hourly');
  const [data, setData] = useState<AdminLoginStatPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');
    fetchAdminLoginStatsAction(period).then((result) => {
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#1E2125]">로그인 수</h2>
        <div className="flex items-center gap-1.5">
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
        )}
      </div>
    </div>
  );
}
