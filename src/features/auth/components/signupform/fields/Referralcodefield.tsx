'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { checkReferralCode } from "@/services/auth.service"

interface ReferralCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  isChecked: boolean;
  onCheckedChange: (value: boolean) => void;
}

export default function ReferralCodeField({
  value,
  onChange,
  isChecked,
  onCheckedChange,
}: ReferralCodeFieldProps) {
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false);

  const inputCls= (error: boolean) =>
    `w-full h-9 px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none transition-colors ${
      error ? 'border-[#FF5F5F]' : 'border-[#D1D5DB] focus:border-[#1E2125]'
    }`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    onCheckedChange(false);
    setMessage('');
    setHasError(false);
  };
 
  const handleCheck = async () => {
    if (!value) {
      setMessage('추천인 코드를 입력해주세요.');
      setHasError(true);
      return;
    }
    try {
      const result = await checkReferralCode(value);
      if (result.available) {
        onCheckedChange(true);
        setHasError(false);
        setMessage('추천인 코드 확인이 완료되었습니다.');
      } else {
        onCheckedChange(false);
        setHasError(true);
        setMessage('사이트 회원 중 일치하는 추천인 코드가 없습니다. 코드를 다시 한번 확인해주세요');
      }
    } catch {
      onCheckedChange(false);
      setHasError(true);
      setMessage('추천인 확인 중 에러가 발생했습니다.');
    }
  };

  return (
    <div className="pt-6">
        <label className="block text-[14px] font-bold text-[#1E2125] mb-1.5">
          추천인 코드 (선택)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="추천인 코드를 입력해주세요"
            className={inputCls(hasError)}
            disabled={isChecked}
          />
          <Button
            type="button"
            onClick={handleCheck}
            disabled={isChecked}
            className={`px-4 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
              isChecked
                ? 'bg-[#FFEBEB] text-[#FF5F5F] hover:bg-[#FFEBEB] cursor-not-allowed'
                : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
            }`}
          >
            {isChecked ? '확인 완료' : '추천인 확인'}
          </Button>
        </div>
        {message && (
          <p
            className={`text-xs mt-1 font-medium ${isChecked ? 'text-[#827717]' : 'text-[#DC2626]'}`}
          >
            {message}
          </p>
        )}
      </div>
  )
}