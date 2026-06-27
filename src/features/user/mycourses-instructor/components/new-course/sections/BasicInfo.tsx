'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';
import type { Category } from '@/features/categories/types';

const LEVELS = ['초급', '중급', '고급'] as const;
export const TITLE_MAX = 50;
export const DESCRIPTION_MAX = 500;

interface FieldErrors {
  title?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  price?: string;
  level?: string;
  thumbnail?: string;
}

interface BasicInfoSectionProps {
  categories: Category[];
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number | '';
  level: string;
  thumbnail: string;
  thumbnailPreviewUrl: string;
  thumbnailUploading: boolean;
  isLoading: boolean;
  errors: FieldErrors;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubCategoryChange: (value: string) => void;
  onPriceChange: (value: number | '') => void;
  onLevelChange: (value: string) => void;
  onThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicInfoSection({
  categories,
  title,
  description,
  category,
  subCategory,
  price,
  level,
  thumbnail,
  thumbnailPreviewUrl,
  thumbnailUploading,
  isLoading,
  errors,
  onTitleChange,
  onDescriptionChange,
  onCategoryChange,
  onSubCategoryChange,
  onPriceChange,
  onLevelChange,
  onThumbnailUpload,
}: BasicInfoSectionProps) {
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const subCategories = categories.find((c) => c.name === category)?.options ?? [];

  const inputCls =
    'w-full h-11 px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';
  const labelCls = 'block text-[13px] font-semibold text-[#1E2125] mb-1.5';
  const requiredMark = <span className="text-[#FF5E5E] ml-0.5">*</span>;
  const fieldErrorCls = 'text-[12px] text-[#FF5E5E] mt-1';
  const borderCls = (hasError?: string) => (hasError ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]');

  return (
    <section aria-labelledby="basic-info-heading" className="flex flex-col gap-5">
      <h2
        id="basic-info-heading"
        className="text-[16px] font-bold text-[#1E2125] pb-2 border-b border-[#E5E7EB]"
      >
        기본 정보
      </h2>

      {/* 강의 제목 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="course-title" className="text-[13px] font-semibold text-[#1E2125]">
            강의 제목{requiredMark}
          </label>
          <span className="text-[12px] text-[#9CA3AF]">
            {title.length}/{TITLE_MAX}
          </span>
        </div>
        <input
          id="course-title"
          type="text"
          placeholder="강의 제목을 입력하세요"
          value={title}
          onChange={(e) => onTitleChange(e.target.value.slice(0, TITLE_MAX))}
          maxLength={TITLE_MAX}
          disabled={isLoading}
          className={`${inputCls} ${borderCls(errors.title)}`}
        />
        {errors.title && <p className={fieldErrorCls}>{errors.title}</p>}
      </div>

      {/* 강의 설명 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="course-description" className="text-[13px] font-semibold text-[#1E2125]">
            강의 설명{requiredMark}
          </label>
          <span className="text-[12px] text-[#9CA3AF]">
            {description.length}/{DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          id="course-description"
          placeholder="강의 설명을 입력하세요"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value.slice(0, DESCRIPTION_MAX))}
          maxLength={DESCRIPTION_MAX}
          rows={5}
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none ${borderCls(errors.description)}`}
        />
        {errors.description && <p className={fieldErrorCls}>{errors.description}</p>}
      </div>

      {/* 카테고리 + 세부 카테고리 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>카테고리{requiredMark}</label>
          <Select value={category} onValueChange={onCategoryChange} disabled={isLoading}>
            <SelectTrigger
              className={`h-11! text-[13.5px] text-[#1E2125] ${borderCls(errors.category)}`}
            >
              <SelectValue placeholder="셀렉트박스" />
            </SelectTrigger>
            <SelectContent position="popper">
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name} className="text-[13px]">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className={fieldErrorCls}>{errors.category}</p>}
        </div>
        <div>
          <label className={labelCls}>세부 카테고리{requiredMark}</label>
          <Select
            value={subCategory}
            onValueChange={onSubCategoryChange}
            disabled={!category || isLoading}
          >
            <SelectTrigger
              className={`h-11! text-[13.5px] text-[#1E2125] ${borderCls(errors.subCategory)}`}
            >
              <SelectValue placeholder="셀렉트박스" />
            </SelectTrigger>
            <SelectContent position="popper">
              {subCategories.map((sub) => (
                <SelectItem key={sub.id} value={String(sub.id)} className="text-[13px]">
                  {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subCategory && <p className={fieldErrorCls}>{errors.subCategory}</p>}
        </div>
      </div>

      {/* 가격 + 난이도 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="course-price" className={labelCls}>
            가격 (크레딧){requiredMark}
          </label>
          <input
            id="course-price"
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => onPriceChange(e.target.value === '' ? '' : Number(e.target.value))}
            min={0}
            disabled={isLoading}
            className={`${inputCls} ${borderCls(errors.price)}`}
          />
          {errors.price && <p className={fieldErrorCls}>{errors.price}</p>}
        </div>
        <div>
          <label className={labelCls}>난이도{requiredMark}</label>
          <Select value={level} onValueChange={onLevelChange} disabled={isLoading}>
            <SelectTrigger
              className={`h-11! text-[13.5px] text-[#1E2125] ${borderCls(errors.level)}`}
            >
              <SelectValue placeholder="셀렉트박스" />
            </SelectTrigger>
            <SelectContent position="popper">
              {LEVELS.map((lv) => (
                <SelectItem key={lv} value={lv} className="text-[13px]">
                  {lv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.level && <p className={fieldErrorCls}>{errors.level}</p>}
        </div>
      </div>

      {/* 대표 이미지 */}
      <div>
        <label className={labelCls}>대표 이미지{requiredMark}</label>
        <input
          type="file"
          accept="image/*"
          ref={thumbnailRef}
          onChange={onThumbnailUpload}
          className="hidden"
          disabled={isLoading || thumbnailUploading}
        />
        <Button
          type="button"
          onClick={() => thumbnailRef.current?.click()}
          disabled={isLoading || thumbnailUploading}
          className={`w-full h-12 rounded-lg border border-dashed bg-[#F9FAFB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] hover:bg-[#F9FAFB] flex items-center justify-center gap-2 disabled:opacity-70 ${
            errors.thumbnail ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
          }`}
        >
          {thumbnailUploading ? (
            <InlineDotsLoading />
          ) : (
            <>
              <span>↑</span>
              {thumbnail ? '이미지 변경하기' : '강의 대표 이미지를 업로드하세요'}
            </>
          )}
        </Button>
        {errors.thumbnail && <p className={fieldErrorCls}>{errors.thumbnail}</p>}
        {(thumbnailPreviewUrl || thumbnail) && (
          <figure className="relative mt-2 w-full h-40 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F3F4F6]">
            <Image
              src={thumbnailPreviewUrl || thumbnail}
              alt="썸네일 미리보기"
              fill
              unoptimized
              className="object-cover"
            />
          </figure>
        )}
      </div>
    </section>
  );
}
