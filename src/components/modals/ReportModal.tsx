'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface ReportCategoryOption {
  value: 'ABUSE' | 'SPAM' | 'FALSE_INFO' | 'OTHER';
  label: string;
}

const REPORT_CATEGORIES: ReportCategoryOption[] = [
  { value: 'ABUSE', label: '욕설 및 비방' },
  { value: 'SPAM', label: '스팸 및 광고' },
  { value: 'FALSE_INFO', label: '허위 정보' },
  { value: 'OTHER', label: '기타' },
];

interface ReportModalProps {
  onConfirm: (category: ReportCategoryOption['value'], reason: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ReportModal({
  onConfirm,
  onCancel,
  loading = false,
}: ReportModalProps) {
  const [category, setCategory] = useState<ReportCategoryOption['value'] | ''>('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isCategoryValid = !!category;
  // '기타'는 사유가 명확하지 않으므로 상세 내용 입력이 필수, 나머지 카테고리는 선택
  const isReasonRequired = category === 'OTHER';
  const isReasonValid = !isReasonRequired || !!reason.trim();
  const isValid = isCategoryValid && isReasonValid;
  const isError = submitted && !isValid;

  const fieldErrorCls = 'text-[12px] text-[#FF5E5E] mt-1';

  const handleConfirm = () => {
    setSubmitted(true);
    if (!isValid || !category) return;
    onConfirm(category, reason.trim());
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
        <h3 className="text-[18px] font-bold text-[#1E2125] mb-5">신고 사유를 선택해 주세요.</h3>

        <div className="flex flex-col gap-2.5 mb-5">
          {REPORT_CATEGORIES.map((c) => (
            <label
              key={c.value}
              className="flex items-center gap-2.5 cursor-pointer w-fit"
              onClick={() => setCategory(c.value)}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  category === c.value ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
                }`}
              >
                {category === c.value && <span className="w-2 h-2 rounded-full bg-[#FF5E5E]" />}
              </span>
              <span className="text-[14px] text-[#1E2125]">{c.label}</span>
            </label>
          ))}
        </div>
        {isError && !isCategoryValid && (
          <p className={`${fieldErrorCls} -mt-3 mb-3`}>신고 사유를 선택해주세요.</p>
        )}

        <div className="mb-2">
          <label className="block text-[13px] font-semibold text-[#1E2125] mb-1.5">
            상세 내용{' '}
            {isReasonRequired ? (
              <span className="text-[#FF5E5E]">*</span>
            ) : (
              <span className="text-[12px] text-[#9CA3AF] font-normal">(선택)</span>
            )}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 200))}
            maxLength={200}
            rows={4}
            placeholder="신고 사유를 입력해주세요"
            className={`w-full px-4 py-3 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#6A7282] transition-colors resize-none ${
              isError && !isReasonValid ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
            }`}
          />
          <div className="flex items-center justify-between mt-1">
            {isError && !isReasonValid ? (
              <p className={fieldErrorCls}>상세 사유를 입력해주세요.</p>
            ) : (
              <span />
            )}
            <p className="text-[11.5px] text-[#6A7282]">{reason.length}/200</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
          >
            {loading ? '신고 중...' : '신고하기'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}