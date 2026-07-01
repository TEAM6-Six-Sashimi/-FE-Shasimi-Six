'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export interface FilterValues {
  priceRange: [number, number];
  ratingRange: [number, number];
}

interface FilterDropdownProps {
  open: boolean;
  onApply: (filters: FilterValues) => void;
  onReset: () => void;
}

const DEFAULT_FILTERS: FilterValues = {
  priceRange: [0, 100000],
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
