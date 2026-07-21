'use client';

import { Button } from '@/components/ui/button';
import type { UseEmailVerificationResult } from '../hooks/useEmailVerification';
import FieldLabel, { FieldLabelVariant } from './FieldLabel';

interface EmailVerifyFieldProps {
  verification: UseEmailVerificationResult;
  inputHeightClass?: string;
  labelVariant?: FieldLabelVariant;
}

export default function EmailVerifyField({
  verification,
  inputHeightClass = 'h-9',
  labelVariant = 'medium',
}: EmailVerifyFieldProps) {
  const {
    email,
    setEmail,
    isEmailValid,
    code,
    setCode,
    isSending,
    isSent,
    sendMessage,
    canSend,
    handleSend,
    isVerifying,
    isVerified,
    codeMessage,
    canVerify,
    handleVerify,
  } = verification;

  const emailHasError = email !== '' && !isEmailValid;

  const inputCls = (hasError: boolean) =>
    `w-full ${inputHeightClass} px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none transition-colors ${
      hasError ? 'border-[#FF5F5F]' : 'border-[#D1D5DB] focus:border-[#1E2125]'
    }`;

  return (
    <div className="mb-4">
      <FieldLabel label="이메일" variant={labelVariant} />
      <div className="flex gap-1.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isVerified}
          placeholder="example@email.com"
          className={inputCls(emailHasError)}
        />
        <Button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={`px-3 ${inputHeightClass} text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
            isVerified
              ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
              : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
          }`}
        >
          {isSending
            ? '발송 중...'
            : isVerified
              ? '인증 완료'
              : isSent
                ? '재발송'
                : '인증번호 발송'}
        </Button>
      </div>

      {emailHasError && (
        <p className="text-xs mt-1 font-medium text-[#DC2626]">올바른 이메일 형식을 지켜주세요</p>
      )}
      {!emailHasError && sendMessage && (
        <p className="text-xs mt-1 font-medium text-[#6A7282]">{sendMessage}</p>
      )}

      {isSent && (
        <div className="mt-2">
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="인증번호 8자리 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isVerified}
              className={inputCls(!!codeMessage && !isVerified)}
            />
            <Button
              type="button"
              onClick={handleVerify}
              disabled={!canVerify}
              className={`px-4 ${inputHeightClass} text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
                isVerified
                  ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                  : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
              }`}
            >
              {isVerifying ? '확인 중...' : isVerified ? '인증 완료' : '인증 확인'}
            </Button>
          </div>
          {codeMessage && (
            <p
              className={`text-xs mt-1 font-medium ${
                isVerified ? 'text-[#5C7A00]' : 'text-[#DC2626]'
              }`}
            >
              {codeMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
