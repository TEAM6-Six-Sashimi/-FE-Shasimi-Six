'use client';

import { LoginStatsPeriod } from '../types';

const PERIOD_OPTIONS: { value: LoginStatsPeriod; label: string }[] = [
  { value: 'daily', label: '요일' },
  { value: 'hourly', label: '시간대' },
];

interface Props {
  period: LoginStatsPeriod;
  onChange: (period: LoginStatsPeriod) => void;
}

export default function PeriodToggle({ period, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
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
  );
}
