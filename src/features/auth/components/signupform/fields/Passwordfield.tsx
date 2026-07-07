'use client'

import { useEffect, useState } from "react"
import Image from "next/image"

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

interface PasswordFieldsProps {
  password: string;
  onPasswordChange: (value: string) => void;
  passwordConfirm: string;
  onPasswordConfirmChange: (value: string) => void;
  onMatchedChange: (value: boolean) => void;
}
 
export default function PasswordFields({
  password,
  onPasswordChange,
  passwordConfirm,
  onPasswordConfirmChange,
  onMatchedChange,
}: PasswordFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isMatched, setIsMatched] = useState(false);
 
  const isFormatValid = PASSWORD_REGEX.test(password);
  const passwordHasError = password !== '' && !isFormatValid;
  const passwordConfirmHasError = passwordConfirm !== '' && !isMatched;
 
  const inputCls = (error: boolean) =>
    `w-full h-9 px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none transition-colors ${
      error ? 'border-[#FF5F5F]' : 'border-[#D1D5DB] focus:border-[#1E2125]'
    }`;
 
  // 비밀번호 형식 + 일치 여부 검사
  useEffect(() => {
    if (!password) {
      setPasswordMessage('');
    } else if (!isFormatValid) {
      setPasswordMessage('비밀번호 형식을 확인해주세요');
    } else {
      setPasswordMessage('');
    }
 
    let matched = false;
    if (password && passwordConfirm) {
      matched = password === passwordConfirm;
    }
    setIsMatched(matched);
    onMatchedChange(matched);
  }, [password, passwordConfirm, isFormatValid, onMatchedChange]);
 
  return (
    <>
      <div className="mb-4">
        <div className="flex mb-1">
          <p className="text-[15px] font-semibold text-[#1E2125]">비밀번호</p>
          <p className="text-[#FF5F5F]">*</p>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className={`${inputCls(passwordHasError)} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
            aria-label={showPassword ? '비밀번호 보이기' : '비밀번호 숨기기'}
          >
            <Image
              src={showPassword ? '/auth/closeeye.svg' : '/auth/openeye.svg'}
              alt="비밀번호 보이기"
              width={20}
              height={20}
            />
          </button>
        </div>
        <p className="text-[12px] text-[#6A7282] mt-0.5">
          대소문자, 숫자, 특수문자(!@#$%^_) 포함, 8자 이상 16자 이하
        </p>
        {passwordHasError && (
          <p className="text-xs mt-1 font-medium text-[#DC2626]">{passwordMessage}</p>
        )}
      </div>
 
      <div className="mb-10">
        <div className="flex">
          <p className="text-[15px] font-semibold text-[#1E2125]">비밀번호 확인</p>
          <p className="text-[#FF5F5F]">*</p>
        </div>
        <div className="relative">
          <input
            type={showPasswordConfirm ? 'text' : 'password'}
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => onPasswordConfirmChange(e.target.value)}
            className={`${inputCls(passwordConfirmHasError)} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer "
            aria-label={showPasswordConfirm ? '비밀번호 보이기' : '비밀번호 숨기기'}
          >
            <Image
              src={showPasswordConfirm ? '/auth/closeeye.svg' : '/auth/openeye.svg'}
              alt="비밀번호 보이기"
              width={20}
              height={20}
            />
          </button>
        </div>
        {passwordConfirm && (
          <p className={`text-xs mt-1 font-medium ${isMatched ? '' : 'text-[#DC2626]'}`}>
            {isMatched ? '' : '비밀번호가 일치하지 않습니다.'}
          </p>
        )}
      </div>
    </>
  );
}