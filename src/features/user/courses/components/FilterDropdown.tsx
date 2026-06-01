'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export interface FilterValues {
  level: string;
  priceRange: [number, number];
  durationRange: [number, number];
  ratingRange: [number, number];
}

interface FilterDropdownProps {
  open: boolean;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
}

const DEFAULT_FILTERS: FilterValues = {
  level: '전체',
  priceRange: [0, 100000],
  durationRange: [0, 1000],
  ratingRange: [0, 5],
};

export default function FilterDropdown({ open, onApply, onReset }: FilterDropdownProps) {
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    onReset();
  };

  if (!open) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-70 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl shadow-lg z-40 p-5 flex flex-col gap-5">
      {/* 난이도 */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1E2125] text-[13px] font-semibold">난이도</label>
        <div className="flex gap-1.5 flex-wrap">
          {['전체', '초급', '중급', '고급'].map((level) => (
            <button
              key={level}
              onClick={() => setFilters((prev) => ({ ...prev, level }))}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors duration-150 cursor-pointer ${
                filters.level === level
                  ? 'bg-[#1E2125] text-white border-[#1E2125]'
                  : 'bg-white text-[#6A7282] border-[#D1D5DB] hover:border-[#1E2125] hover:text-[#1E2125]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 가격 범위 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[#1E2125] text-[13px] font-semibold">가격</label>
          <span className="text-[#6A7282] text-[12px]">
            {filters.priceRange[0].toLocaleString()} ~ {filters.priceRange[1].toLocaleString()}{' '}
            크레딧
          </span>
        </div>
        <Slider
          min={0}
          max={100000}
          step={1000}
          value={filters.priceRange}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, priceRange: v as [number, number] }))
          }
          className="w-full"
        />
      </div>

      {/* 강의 시간 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[#1E2125] text-[13px] font-semibold">강의 시간</label>
          <span className="text-[#6A7282] text-[12px]">
            {filters.durationRange[0]}시간 ~ {filters.durationRange[1]}시간
          </span>
        </div>
        <Slider
          min={0}
          max={1000}
          step={1}
          value={filters.durationRange}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, durationRange: v as [number, number] }))
          }
          className="w-full"
        />
      </div>

      {/* 평점 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-[#1E2125] text-[13px] font-semibold">평점</label>
          <span className="text-[#6A7282] text-[12px]">
            {filters.ratingRange[0].toFixed(1)} ~ {filters.ratingRange[1].toFixed(1)}
          </span>
        </div>
        <Slider
          min={0}
          max={5}
          step={0.1}
          value={filters.ratingRange}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, ratingRange: v as [number, number] }))
          }
          className="w-full"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex-1 border-[#D1D5DB] text-[#6A7282] text-[12.5px] h-9 cursor-pointer"
        >
          초기화
        </Button>
        <Button
          size="sm"
          onClick={() => onApply(filters)}
          className="flex-1 bg-[#CFEE5D] hover:bg-[#A8D014] text-[#1E2125] text-[12.5px] font-semibold h-9 cursor-pointer"
        >
          조회
        </Button>
      </div>
    </div>
  );
}
