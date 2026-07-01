'use client';

import { formatYearMonthDay } from '@/lib/utils';

interface BirthdateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BirthdateField({ value, onChange }: BirthdateFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatYearMonthDay(e.target.value));
  };

  return (
    <div className="mb-4">
      <div className="flex mb-1">
        <p className="text-[15px] font-semibold text-[#1E2125]">생년월일</p>
        <p className="text-[#FF5F5F]">*</p>
      </div>
      <input
        type="text"
        name="birth_date"
        value={value}
        onChange={handleChange}
        placeholder="YYYY-MM-DD"
        maxLength={10}
        className="w-full h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
        required
      />
    </div>
  );
}
