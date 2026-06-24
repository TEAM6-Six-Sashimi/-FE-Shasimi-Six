'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminCategory } from '../../type';

interface CategoryRegisterModalProps {
  categories: AdminCategory[];
  onClose: () => void;
  onSubmit: (data: { name: string; subCategory: string }) => void;
}

export default function CategoryRegisterModal({
  categories,
  onClose,
  onSubmit,
}: CategoryRegisterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const isCustom = selectedCategory === 'custom';
  const mainCategories = [...new Set(categories.map((c) => c.mainCategoryName))];

  const handleSubmit = () => {
    const mainCategoryName = isCustom ? customCategory.trim() : selectedCategory;

    if (!mainCategoryName || !subCategory.trim()) return;

    onSubmit({
      name: mainCategoryName,
      subCategory: subCategory.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-175 rounded-[28px] bg-white px-13 py-12 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-[40px] font-extrabold text-[#1E2125]">카테고리 등록</h2>
        </div>

        {/* 카테고리명 */}
        <div className="mb-8">
          <label className="mb-3 block text-[20px] font-bold text-[#1E2125]">
            카테고리명 <span className="text-[#FF5F5F]">*</span>
          </label>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-16 rounded-[20px] border-[#D0D5DD] text-[20px]">
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>

            <SelectContent position="popper" side="bottom">
              {mainCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}

              <SelectItem value="custom">직접 입력</SelectItem>
            </SelectContent>
          </Select>

          {isCustom && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="예: AI·데이터"
              className="mt-4 h-16 w-full rounded-[20px] border border-[#D0D5DD] px-6 text-[20px] outline-none"
            />
          )}
        </div>

        {/* 세부 카테고리명 */}
        <div className="mb-12">
          <label className="mb-3 block text-[20px] font-bold text-[#1E2125]">
            세부 카테고리명 <span className="text-[#FF5E5E]">*</span>
          </label>

          <input
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="예: AI 디자인·이미지"
            className="h-16 w-full rounded-[20px] border border-[#D0D5DD] px-6 text-[20px] outline-none"
          />
        </div>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-5">
          <Button
            onClick={handleSubmit}
            className="flex-1 py-3 h-auto rounded-xl bg-[#FF5E5E] text-white text-[15px] font-medium hover:bg-[#D14848]"
          >
            등록
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 py-3 h-auto rounded-xl border border-[#D1D5DB] text-[#1E2125] text-[15px] font-medium hover:bg-[#F9FAFB] hover:text-[#1E2125]"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
