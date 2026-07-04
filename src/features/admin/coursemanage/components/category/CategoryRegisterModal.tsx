'use client';

import { useEffect, useState } from 'react';
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
  mode?: 'create' | 'edit';
  initialData?: AdminCategory;
  onClose: () => void;
  onSubmit: (data: { name: string; subCategory: string }) => void;
}

export default function CategoryRegisterModal({
  categories,
  mode = 'create',
  initialData,
  onClose,
  onSubmit,
}: CategoryRegisterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  // 유효성 에러 상태 관리
  const [errors, setErrors] = useState<{ main?: string; sub?: string }>({});

  const isCustom = selectedCategory === 'custom';
  const mainCategories = [...new Set(categories.map((c) => c.mainCategoryName))];

  // 초기 값 설정 (수정 모드 대응)
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setSelectedCategory(initialData.mainCategoryName);
      setSubCategory(initialData.subCategory);
    }
  }, [mode, initialData]);

  const handleSubmit = () => {
    const mainCategoryName = isCustom ? customCategory.trim() : selectedCategory;
    const newErrors: { main?: string; sub?: string } = {};

    if (!mainCategoryName.trim()) {
      newErrors.main = '카테고리명을 설정하거나 입력해주세요.';
    }

    if (!subCategory.trim()) {
      newErrors.sub = '세부 카테고리명을 입력해주세요.';
    }

    // 에러 존재 시 중단 및 테두리 업데이트
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      name: mainCategoryName,
      subCategory: subCategory.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-7 w-full max-w-100 shadow-xl">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[19px] font-bold text-[#1E2125]">
            {mode === 'edit' ? '카테고리 수정' : '카테고리 등록'}
          </h2>
        </div>

        {/* 카테고리명(대카테고리) */}
        <div className="mb-4">
          <label className="mb-3 block text-[14px] font-semibold text-[#1E2125]">
            카테고리명 <span className="text-[#FF5F5F]">*</span>
          </label>

          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val);
              setErrors((prev) => ({ ...prev, main: undefined }));
            }}
            disabled={mode === 'edit'} // 수정 모드일 때 대카테고리 수정 비활성화
          >
            <SelectTrigger
              className={`h-11! rounded-lg border text-[14px] ${
                errors.main ? 'border-[#FF5F5F] focus:ring-[#FF5F5F]' : 'border-[#D0D5DD]'
              }`}
            >
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
              onChange={(e) => {
                setCustomCategory(e.target.value);
                setErrors((prev) => ({ ...prev, main: undefined }));
              }}
              disabled={mode === 'edit'}
              placeholder="예: AI·데이터"
              className={`mt-2 h-11! rounded-lg w-full border px-6 text-[14px] outline-none transition-colors ${
                errors.main ? 'border-[#FF5F5F]' : 'border-[#D0D5DD] focus:border-[#1E2125]'
              }`}
            />
          )}
          {errors.main && <p className="text-[11.5px] text-[#DC2626] mt-1.5 pl-1">{errors.main}</p>}
        </div>

        {/* 세부 카테고리명 */}
        <div className="mb-8">
          <label className="mb-3 block text-[14px] font-semibold text-[#1E2125]">
            세부 카테고리명 <span className="text-[#FF5E5E]">*</span>
          </label>

          <input
            type="text"
            value={subCategory}
            onChange={(e) => {
              setSubCategory(e.target.value);
              setErrors((prev) => ({ ...prev, sub: undefined }));
            }}
            placeholder="예: AI 디자인·이미지"
            className={`h-11! w-full rounded-lg border px-6 text-[14px] outline-none transition-colors ${
              errors.sub ? 'border-[#FF5F5F]' : 'border-[#D0D5DD] focus:border-[#1E2125]'
            }`}
          />
          {errors.sub && <p className="text-[11.5px] text-[#DC2626] mt-1.5 pl-1">{errors.sub}</p>}
        </div>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-5">
          <Button
            onClick={handleSubmit}
            className="h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
          >
            {mode === 'edit' ? '수정' : '등록'}
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] hover:border-[#6A7282] cursor-pointer"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
