'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { sendEmailVerification, verifyEmailCode } from "@/services/auth.service"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailVerifyFieldProps {
  email: string;
  onEmailChange: (value: string) => void;
  verified: boolean;
  onVerifiedChange: (value: boolean) => void;
  isVerificationSent: boolean;
  onVerificationSentChange: (value: boolean) => void;
}

export default function EmailVerifyField({
  email,
  onEmailChange,
  verified,
  onVerifiedChange,
  isVerificationSent,
  onVerificationSentChange,
}: EmailVerifyFieldProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  const isEmailFormatValid = EMAIL_REGEX.test(email);
  const emailHasError = email !== '' && !isEmailFormatValid;
  const verifyCodeHasError = message === '인증번호를 확인해주세요';

  const inputCls = (hasError: boolean) =>
    `w-full h-9 px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none transition-colors ${
      hasError ? 'border-[#FF5F5F]' : 'border-[#D1D5DB] focus:border-[#1E2125]'
    }`;

  // 이메일 수정 감지 시 인증 상태 전부 초기화
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEmailChange(e.target.value);
    onVerifiedChange(false);
    onVerificationSentChange(false);
    setVerificationCode('');
    setMessage('');
  };

  // 인증번호 입력 8자리 제한
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value.slice(0, 8));
  };
 
  const handleEmailSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
 
    if (!isEmailFormatValid) {
      setMessage('이메일 형식을 지켜주세요');
      return;
    }
 
    try {
      setMessage('인증번호를 발송 중입니다.');
      await sendEmailVerification(email);
      onVerificationSentChange(true);
      setMessage('인증번호가 메일로 발송되었습니다. 확인 후 입력해 주세요.');
    } catch {
      onVerificationSentChange(false);
      setMessage('인증번호 발송에 실패했습니다. 다시 시도해 주세요.');
    }
  };
 
  const handleEmailVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
 
    if (!verificationCode || verificationCode.trim() === '') {
      setMessage('인증번호를 입력해 주세요.');
      return;
    }
    try {
      const isSuccess = await verifyEmailCode(email, verificationCode);
      if (isSuccess) {
        onVerifiedChange(true);
        setMessage('이메일 인증이 완료되었습니다!');
      } else {
        onVerifiedChange(false);
        setMessage('인증번호를 확인해주세요');
      }
    } catch {
      onVerifiedChange(false);
      setMessage('인증번호를 확인해주세요');
    }
  };
 
  return (
    <div className="mb-4">
      <div className="flex mb-1">
        <p className="text-[15px] font-semibold text-[#1E2125]">이메일</p>
        <p className="text-[#FF5F5F]">*</p>
      </div>
      <div className="flex gap-1.5">
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          disabled={verified}
          required
          className={inputCls(emailHasError)}
        />
        <Button
          type="button"
          onClick={handleEmailSend}
          disabled={verified || isVerificationSent}
          className={`px-3 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
            verified || isVerificationSent
              ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
              : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
          }`}
        >
          {verified || isVerificationSent ? '발송됨' : '인증번호 발송'}
        </Button>
      </div>
 
      {!emailHasError && message && (
        <p
          className={`text-xs mt-1 font-medium ${
            verifyCodeHasError ? 'text-[#DC2626]' : 'text-[#6A7282]'
          }`}
        >
          {message}
        </p>
      )}
      {emailHasError && (
        <p className="text-xs mt-1 font-medium text-[#DC2626]">이메일 형식을 지켜주세요</p>
      )}
 
      {isVerificationSent && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="인증번호 8자리 입력"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            disabled={verified}
            className={inputCls(verifyCodeHasError)}
          />
          <Button
            type="button"
            onClick={handleEmailVerify}
            disabled={verified}
            className={`px-4 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
              verified
                ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
            }`}
          >
            {verified ? '인증 완료' : '인증 확인'}
          </Button>
        </div>
      )}
    </div>
  );
}
