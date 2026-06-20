'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserMe } from '@/features/auth/types';
import { Category } from '@/features/categories/types';

export interface Step01Data {
  profileImage: File | null;
  introduction: string;
  motivation: string;
  categoryId: number | null;
}

interface Step01IntroductionProps {
  userInfo: UserMe;
  categories: Category[];
  data: Step01Data;
  onNext: (data: Step01Data) => void;
}

export default function Step01Introduction({
  userInfo,
  categories,
  data,
  onNext,
}: Step01IntroductionProps) {
  const [form, setForm] = useState<Step01Data>(data);
  const [submitted, setSubmitted] = useState(false);
  const profileImageRef = useRef<HTMLInputElement>(null);

  const previewUrl = form.profileImage ? URL.createObjectURL(form.profileImage) : null;

  const isIntroductionValid = !!form.introduction.trim();
  const isMotivationValid = !!form.motivation.trim();
  const isCategoryValid = form.categoryId !== null;

  const isValid = isIntroductionValid && isMotivationValid && isCategoryValid;
  const isError = submitted && !isValid;

  const handleNext = () => {
    setSubmitted(true);
    if (!isValid) return;
    onNext(form);
  };

  const handleProfileImageChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, profileImage: file }));
  };

  const labelCls = 'block text-[13.5px] font-semibold text-[#1E2125] mb-1.5';
  const fieldErrorCls = 'text-[12px] text-[#FF5E5E] mt-1';

  return (
    <div className="flex flex-col gap-6">
      {/* 안내 메시지 */}
      <div
        role={isError ? 'alert' : undefined}
        className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-colors ${
          isError ? 'bg-[#FFEBEB]' : 'bg-[#FEFCE8]'
        }`}
      >
        <span className={`font-semibold ${isError ? 'text-[#DC2626]' : 'text-[#854D0E]'}`}>ⓘ</span>
        <p className={`text-[13px] ${isError ? 'text-[#DC2626]' : 'text-[#854D0E]'}`}>
          강사님의 기본 정보를 입력해주세요. 모든 필수 항목을 완료 후 다음 단계로 이동합니다.
        </p>
      </div>

      {/* 프로필 사진 + 로그인 정보 */}
      <div className="flex items-center gap-6">
        {/* 프로필 사진 + 업로드 버튼 (박스 밖, 독립) */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-20 h-20 rounded-full bg-[#E5E7EB] overflow-hidden flex items-center justify-center text-[#6A7282]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="프로필 미리보기"
                width={80}
                height={80}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 24 24" className="w-9 h-9 fill-none stroke-current stroke-[1.5]">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <input
            type="file"
            ref={profileImageRef}
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleProfileImageChange(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => profileImageRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#FF5E5E] text-[#FF5E5E] text-[11.5px] font-medium hover:bg-[#FFEBEB] transition-colors cursor-pointer"
          >
            <span className="text-[11px]">↑</span> 사진 업로드
          </button>
        </div>

        {/* 로그인 정보 (회색 박스로 감싸짐) */}
        <div className="flex-1 border border-[#E5E7EB] bg-[#F9FAFB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Image src="/auth/lock.svg" alt="" width={16} height={16} />
            <span className="text-[12px] text-[#6A7282]">로그인 정보 (수정 불가)</span>
          </div>
          <p className="text-[14.5px] font-bold text-[#1E2125]">{userInfo.name}</p>
          <p className="text-[13px] text-[#6A7282] mt-0.5">{userInfo.email}</p>
        </div>
      </div>

      {/* 자기소개 (필수) */}
      <div>
        <label htmlFor="introduction" className={labelCls}>
          자기소개 <span className="text-[#FF5E5E]">*</span>
        </label>
        <Textarea
          id="introduction"
          placeholder="강사님의 자기소개를 입력해주세요."
          value={form.introduction}
          onChange={(e) => setForm((prev) => ({ ...prev, introduction: e.target.value }))}
          maxLength={500}
          aria-invalid={isError && !isIntroductionValid}
          className={`min-h-32 resize-none text-[13.5px] ${
            isError && !isIntroductionValid ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {isError && !isIntroductionValid ? (
            <p className={fieldErrorCls}>자기소개를 입력해주세요.</p>
          ) : (
            <span />
          )}
          <p className="text-[11.5px] text-[#6A7282]">{form.introduction.length}/500</p>
        </div>
      </div>

      {/* 지원 동기 (필수) */}
      <div>
        <label htmlFor="motivation" className={labelCls}>
          지원 동기 <span className="text-[#FF5E5E]">*</span>
        </label>
        <Textarea
          id="motivation"
          placeholder="강사 지원 동기를 입력해주세요."
          value={form.motivation}
          onChange={(e) => setForm((prev) => ({ ...prev, motivation: e.target.value }))}
          maxLength={500}
          aria-invalid={isError && !isMotivationValid}
          className={`min-h-32 resize-none text-[13.5px] ${
            isError && !isMotivationValid ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
          }`}
        />
        <div className="flex items-center justify-between mt-1">
          {isError && !isMotivationValid ? (
            <p className={fieldErrorCls}>지원 동기를 입력해주세요.</p>
          ) : (
            <span />
          )}
          <p className="text-[11.5px] text-[#6A7282]">{form.motivation.length}/500</p>
        </div>
      </div>

      {/* 지원 카테고리 (필수) */}
      <div>
        <label htmlFor="category" className={labelCls}>
          지원 카테고리 <span className="text-[#FF5E5E]">*</span>
        </label>
        <Select
          value={form.categoryId ? String(form.categoryId) : undefined}
          onValueChange={(v) => setForm((prev) => ({ ...prev, categoryId: Number(v) }))}
        >
          <SelectTrigger
            id="category"
            aria-invalid={isError && !isCategoryValid}
            className={`w-full h-11! px-4 text-[13.5px] ${
              isError && !isCategoryValid ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
            }`}
          >
            <SelectValue placeholder="카테고리를 선택해주세요" />
          </SelectTrigger>
          <SelectContent position="popper" side="top">
            {categories.map((cat) => (
              <SelectItem key={cat.mainCategoryId} value={String(cat.mainCategoryId)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isError && !isCategoryValid && (
          <p className={fieldErrorCls}>지원 카테고리를 선택해주세요.</p>
        )}
      </div>

      {/* 다음 버튼 */}
      <Button
        onClick={handleNext}
        disabled={!isValid}
        className={`w-full h-12 font-semibold text-[14px] transition-colors ${
          isValid
            ? 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
            : 'bg-[#E5E7EB] text-[#6A7282] cursor-not-allowed hover:bg-[#E5E7EB]'
        }`}
      >
        다음 &gt;
      </Button>
    </div>
  );
}