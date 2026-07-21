'use client';

import { Button } from '@/components/ui/button';
import { Category } from '@/features/categories/types';

interface CategorySelectorProps {
  categories: Category[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export default function CategorySelector({
  categories,
  selectedIds,
  onToggle,
}: CategorySelectorProps) {
  return (
    <div>
      <label className="block text-[14px] font-bold text-[#1E2125] mb-3">
        관심 자격증 카테고리를 선택해 주세요 (중복 선택 가능)
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categories.map((cat) => {
          const isSelected = selectedIds.includes(cat.mainCategoryId);
          return (
            <Button
              key={cat.name}
              type="button"
              onClick={() => onToggle(cat.mainCategoryId)}
              className={`py-2.5 px-4 h-auto rounded-full text-[15px] font-semibold border-[1.5px] transition-all duration-100 cursor-pointer ${
                isSelected
                  ? 'bg-[#F9FBE7] text-[#827717] border-transparent hover:bg-[#F9FBE7] hover:text-[#827717]'
                  : 'bg-white text-[#6A7282] border-[#D1D5DB] hover:bg-gray-50 hover:text-[#6A7282]'
              }`}
            >
              {cat.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
