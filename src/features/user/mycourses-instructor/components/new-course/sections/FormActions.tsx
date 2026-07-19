'use client';

import { Button } from '@/components/ui/button';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';

interface FormActionButtonsProps {
  isLoading: boolean;
  isSubmitDisabled: boolean;
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function FormActionButtons({
  isLoading,
  isSubmitDisabled,
  onSave,
  onSubmit,
  onCancel,
}: FormActionButtonsProps) {
  return (
    <nav aria-label="강의 등록 양식 제출" className="flex items-center justify-between pt-2">
      <Button
        type="button"
        onClick={onSave}
        disabled={isSubmitDisabled}
        className={`h-11 px-7 font-semibold text-[14px] transition-colors ${
          isSubmitDisabled
            ? 'bg-[#E5E7EB] text-[#6A7282] cursor-not-allowed hover:bg-[#E5E7EB]'
            : 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
        }`}
      >
        {isLoading ? <InlineDotsLoading /> : '임시 저장'}
      </Button>
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className={`h-11 px-7 font-semibold text-[14px] transition-colors ${
            isSubmitDisabled
              ? 'bg-[#E5E7EB] text-[#6A7282] cursor-not-allowed hover:bg-[#E5E7EB]'
              : 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
          }`}
        >
          {isLoading ? <InlineDotsLoading /> : '승인 요청'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-11 px-7 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
        >
          취소
        </Button>
      </div>
    </nav>
  );
}
