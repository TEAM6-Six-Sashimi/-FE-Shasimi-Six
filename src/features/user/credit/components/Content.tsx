'use client';

import { Button } from '@/components/ui/button';

interface ContentProps {
  selectedAmount: number | null;
  setSelectedAmount: (amount: number | null) => void;
  customAmount: string;
  setCustomAmount: (value: string) => void;
}

const PRESET_OPTIONS = [
  { label: '1만원', credit: 10000 },
  { label: '3만원', credit: 30000 },
  { label: '5만원', credit: 50000 },
  { label: '10만원', credit: 100000 },
];

const MIN_AMOUNT = 10000;
const UNIT_AMOUNT = 1000;

// 직접 입력 금액에 대한 에러 메시지를 반환. 유효하면 null.
function getCustomAmountError(rawValue: string): string | null {
  if (!rawValue) return null; // 빈 값은 아직 입력 전이므로 에러 표시 안 함

  const numeric = parseInt(rawValue.replace(/,/g, ''), 10) || 0;

  if (numeric < MIN_AMOUNT) {
    return `최소 ${MIN_AMOUNT.toLocaleString()}원 이상 입력해주세요.`;
  }
  if (numeric % UNIT_AMOUNT !== 0) {
    return `${UNIT_AMOUNT.toLocaleString()}원 단위로 입력해주세요.`;
  }
  return null;
}

export default function Content({
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
}: ContentProps) {
  const customAmountError = getCustomAmountError(customAmount);
  const hasCustomError = !!customAmountError;

  const handlePresetClick = (credit: number) => {
    if (selectedAmount === credit) {
      setSelectedAmount(null);
    } else {
      setSelectedAmount(credit);
      setCustomAmount('');
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const formatted = raw ? parseInt(raw, 10).toLocaleString() : '';
    setCustomAmount(formatted);
    setSelectedAmount(null);
  };

  return (
    <div>
      <h1 className="text-[27px] font-bold mt-2 mb-8">크레딧 충전</h1>
      <div className="mb-10">
        <h2 className="text-[17px] font-semibold mb-3">충전 금액 선택</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_OPTIONS.map((opt) => {
            const isSelected = selectedAmount === opt.credit;
            return (
              <Button
                key={opt.credit}
                type="button"
                onClick={() => handlePresetClick(opt.credit)}
                className={`flex flex-col items-center justify-center py-7 px-3 h-auto rounded-xl border-[1.5px] transition-all duration-100 cursor-pointer
                  ${
                    isSelected
                      ? 'bg-[#FF5F5F] text-white border-transparent hover:bg-[#FF5F5F]'
                      : 'bg-white border-[#E5E7EB] text-[#1E2125] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
                  }`}
              >
                <span className="text-[15px] font-bold">{opt.label}</span>
                <span
                  className={`text-[12px] mt-1 ${isSelected ? 'text-white' : 'text-[#6A7282]'}`}
                >
                  {opt.credit.toLocaleString()} 크레딧
                </span>
              </Button>
            );
          })}
        </div>
      </div>
      <hr className="mb-10" />
      <div>
        <h2 className="text-[17px] font-semibold mb-3">직접 입력</h2>
        <div
          className={`flex items-center border rounded-xl px-4 py-3 transition-colors duration-150 bg-white
            ${
              hasCustomError
                ? 'border-[#FF5E5E]'
                : customAmount
                  ? 'border-[#1E2125]'
                  : 'border-[#D1D5DB]'
            }`}
        >
          <input
            type="text"
            inputMode="numeric"
            placeholder="충전 금액 입력"
            value={customAmount}
            onChange={handleCustomChange}
            aria-invalid={hasCustomError}
            className="flex-1 text-[15px] text-[#1E2125] placeholder:text-[#6A7282] outline-none bg-transparent"
          />
          <span className="text-[15px] text-[#6A7282] ml-2">원</span>
        </div>

        {hasCustomError ? (
          <p className="text-[12px] text-[#FF5E5E] mt-2 mb-2">⚠ {customAmountError}</p>
        ) : (
          <p className="text-[12px] text-[#6A7282] mt-2 mb-2">
            최소 10,000원 이상, 1,000원 단위로 입력해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
