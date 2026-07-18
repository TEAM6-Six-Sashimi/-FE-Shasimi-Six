'use client';

import { ReactNode } from 'react';
import { LoginStatsPeriod } from '../types';
import PeriodToggle from './PeriodToggle';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';

interface Props {
  title: string;
  period: LoginStatsPeriod;
  onPeriodChange: (period: LoginStatsPeriod) => void;
  isLoading: boolean;
  error: string;
  isEmpty: boolean;
  legend?: ReactNode;
  children: ReactNode;
}

export default function StatsChartCard({
  title,
  period,
  onPeriodChange,
  isLoading,
  error,
  isEmpty,
  legend,
  children,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-6">
      <div className={`flex items-center justify-between ${legend ? 'mb-2' : 'mb-4'}`}>
        <h2 className="text-[16px] font-bold text-[#1E2125]">{title}</h2>
        <PeriodToggle period={period} onChange={onPeriodChange} />
      </div>

      {legend && <div className="flex items-center gap-3 mb-4">{legend}</div>}

      <div className="h-72">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-[13px] text-[#6A7282]">
            <InlineDotsLoading dotColor="#5B8DEE"/>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-[13px] text-[#6A7282]">
            {error}
          </div>
        ) : isEmpty ? (
          <div className="flex items-center justify-center h-full text-[13px] text-[#6A7282]">
            데이터가 없습니다.
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
