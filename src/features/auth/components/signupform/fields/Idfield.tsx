'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { checkLoginIdDuplicate } from "@/services/auth.service"

const LOGIN_ID_REGEX = /^[a-zA-Z0-9]{6,20}$/;

interface LoginIdFieldProps {
  value: string;
  onChange: (value: string) => void;
  isChecked: boolean;
  onCheckedChange: (value: boolean) => void;
  isAvailable: boolean;
  onAvailableChange: (value: boolean) => void;
}
 
export default function LoginIdField({
  value,
  onChange,
  isChecked,
  onCheckedChange,
  isAvailable,
  onAvailableChange,
}: LoginIdFieldProps) {
  const [message, setMessage] = useState('');
 
  const isFormatValid = LOGIN_ID_REGEX.test(value);
  const hasError = value !== '' && !isFormatValid;
 
  const inputCls = (error: boolean) =>
    `w-full h-9 px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none transition-colors ${
      error ? 'border-[#FF5F5F]' : 'border-[#D1D5DB] focus:border-[#1E2125]'
    }`;
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    onCheckedChange(false);
    setMessage('');
  };
 
  const handleCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
 
    if (!isFormatValid) {
      setMessage('아이디 형식을 확인해주세요');
      onAvailableChange(false);
      return;
    }
 
    try {
      const isDuplicate = await checkLoginIdDuplicate(value);
      if (isDuplicate) {
        onCheckedChange(false);
        onAvailableChange(false);
        setMessage('이미 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.');
      } else {
        onCheckedChange(true);
        onAvailableChange(true);
        setMessage('사용 가능한 아이디입니다!');
      }
    } catch {
      onCheckedChange(false);
      onAvailableChange(false);
      setMessage('서버 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };
 
  return (
    <div className="mb-4">
      <div className="flex mb-1">
        <p className="text-[15px] font-semibold text-[#1E2125]">아이디</p>
        <p className="text-[#FF5F5F]">*</p>
      </div>
      <div className="flex gap-1.5">
        <input
          type="text"
          name="login_id"
          value={value}
          onChange={handleChange}
          className={inputCls(hasError)}
        />
        <Button
          type="button"
          onClick={handleCheck}
          disabled={isChecked && isAvailable}
          className={`px-4 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
            isChecked && isAvailable
              ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
              : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
          }`}
        >
          {isChecked && isAvailable ? '확인 완료' : '중복 확인'}
        </Button>
      </div>
      <p className="text-[12px] text-[#6A7282] mt-0.5">영문 대소문자, 숫자 포함 6자 이상 20자 이하</p>
      {hasError ? (
        <p className="text-xs mt-1 font-medium text-[#DC2626]">아이디 형식을 확인해주세요</p>
      ) : (
        message && (
          <p
            className={`text-xs mt-1 font-medium ${isAvailable ? 'text-green-600' : 'text-[#DC2626]'}`}
          >
            {message}
          </p>
        )
      )}
    </div>
  );
}