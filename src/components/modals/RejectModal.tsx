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

export interface RejectCategoryOption {
  value: string;
  label: string;
}

interface RejectModalProps {
  title: string; // 예: "강사 신청 반려", "강의 반려"
  targetLabel: string; // 예: "반려 대상"
  targetName: string; // 예: "김민준 (minjun01)", "React 심화 과정"
  categories: RejectCategoryOption[];
  categoryLabel?: string; // 예: "반려 사유 카테고리"
  detailLabel?: string; // 예: "반려 사유 상세 내용"
  detailPlaceholder?: string;
  maxDetailLength?: number;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (categoryLabel: string, detail: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function RejectModal({
  title,
  targetLabel,
  targetName,
  categories,
  categoryLabel = '반려 사유 카테고리',
  detailLabel = '반려 사유 상세 내용',
  detailPlaceholder = '반려 사유를 상세히 입력해주세요.',
  maxDetailLength = 100,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  loading = false,
}: RejectModalProps) {
  const [category, setCategory] = useState<string>('');
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isCategoryValid = !!category;
  const isDetailValid = !!detail.trim();
  const isValid = isCategoryValid && isDetailValid;
  const isError = submitted && !isValid;

  const fieldErrorCls = 'text-[12px] text-[#FF5E5E] mt-1';

  const handleConfirm = () => {
    setSubmitted(true);
    if (!isValid) return;
    const selectedLabel = categories.find((c) => c.value === category)?.label ?? category;
    onConfirm(selectedLabel, detail.trim());
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[19px] font-bold text-[#1E2125] mb-5">{title}</h3>

        <div className="flex items-center gap-3 bg-[#FFEBEB] rounded-xl px-4 py-3.5 mb-5">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FF5E5E] text-white text-[12px] shrink-0">
            ✕
          </span>
          <div>
            <p className="text-[11.5px] text-[#6A7282]">{targetLabel}</p>
            <p className="text-[15px] font-bold text-[#1E2125]">{targetName}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[13.5px] font-semibold text-[#1E2125] mb-1.5">
            {categoryLabel} <span className="text-[#FF5E5E]">*</span>
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              className={`w-full h-11! px-4 text-[13.5px] ${
                isError && !isCategoryValid ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
              }`}
            >
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom">
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isError && !isCategoryValid && (
            <p className={fieldErrorCls}>{categoryLabel}를 선택해주세요.</p>
          )}
        </div>

        <div className="mb-2">
          <label className="block text-[13.5px] font-semibold text-[#1E2125] mb-1.5">
            {detailLabel} <span className="text-[#FF5E5E]">*</span>
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value.slice(0, maxDetailLength))}
            maxLength={maxDetailLength}
            rows={4}
            placeholder={detailPlaceholder}
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#6A7282] transition-colors resize-none ${
              isError && !isDetailValid ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
            }`}
          />
          <div className="flex items-center justify-between mt-1">
            {isError && !isDetailValid ? (
              <p className={fieldErrorCls}>{detailLabel}을 입력해주세요.</p>
            ) : (
              <span />
            )}
            <p className="text-[11.5px] text-[#6A7282]">
              {detail.length} / {maxDetailLength}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
          >
            {loading ? '처리 중...' : confirmLabel}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}