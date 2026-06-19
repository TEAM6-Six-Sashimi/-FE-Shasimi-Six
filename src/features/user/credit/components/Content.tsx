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

export default function Content({
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
}: ContentProps) {
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
    const formatted = raw ? parseInt(raw).toLocaleString() : '';
    setCustomAmount(formatted);
    setSelectedAmount(null);
  };

  return (
    <div>
      <h1 className="text-[27px] font-bold mt-2 mb-8">크레딧 충전</h1>
      <div className="mb-10">
        <h2 className="text-[17px] font-semibold mb-3">충전 금액 선택</h2>
        <div className="grid grid-cols-4 gap-3">
          {PRESET_OPTIONS.map((opt) => {
            const isSelected = selectedAmount === opt.credit;
            return (
              <Button
                key={opt.credit}
                type="button"
                onClick={() => handlePresetClick(opt.credit)}
                className={`flex flex-col items-center justify-center py-7 px-3 h-auto rounded-xl border-[1.5px] transition-all duration-100
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
          className={`flex items-center border rounded-xl px-4 py-3 transition-colors duration-150
            ${customAmount ? 'border-[#1E2125]' : 'border-[#D1D5DB]'} bg-white`}
        >
          <input
            type="text"
            inputMode="numeric"
            placeholder="충전 금액 입력"
            value={customAmount}
            onChange={handleCustomChange}
            className="flex-1 text-[15px] text-[#1E2125] placeholder:text-[#6A7282] outline-none bg-transparent"
          />
          <span className="text-[15px] text-[#6A7282] ml-2">원</span>
        </div>
        <p className="text-[12px] text-[#6A7282] mt-2 mb-2">
          최소 10,000원 이상, 1,000원 단위로 입력해주세요.
        </p>
      </div>
    </div>
  );
}
