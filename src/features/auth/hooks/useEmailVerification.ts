'use client';

import { useState } from 'react';
import { EMAIL_REGEX, VERIFICATION_CODE_MAX_LENGTH } from '../constants';

interface UseEmailVerificationOptions {
  sendCode: (email: string) => Promise<unknown>;
  verifyCode: (email: string, code: string) => Promise<boolean>;
  initialEmail?: string;
  initialIsSent?: boolean;
  initialIsVerified?: boolean;
}

// 공용 이메일 인증 상태 머신 - 회원가입/아이디 찾기/비밀번호 찾기
export function useEmailVerification({
  sendCode,
  verifyCode,
  initialEmail = '',
  initialIsSent = false,
  initialIsVerified = false,
}: UseEmailVerificationOptions) {
  const [email, setEmailState] = useState(initialEmail);
  const [code, setCodeState] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(initialIsSent);
  const [sendMessage, setSendMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(initialIsVerified);
  const [codeMessage, setCodeMessage] = useState('');

  const isEmailValid = EMAIL_REGEX.test(email);
  const canSend = isEmailValid && !isSending && !isVerified;
  const canVerify = code.trim() !== '' && !isVerifying && !isVerified;

  // 이메일을 다시 수정하면 이전 발송/인증 상태는 의미가 없어지므로 초기화
  const setEmail = (value: string) => {
    setEmailState(value);
    if (isSent || isVerified) {
      setIsSent(false);
      setIsVerified(false);
      setSendMessage('');
      setCodeMessage('');
      setCodeState('');
    }
  };

  const setCode = (value: string) => {
    setCodeState(value.slice(0, VERIFICATION_CODE_MAX_LENGTH));
  };

  const handleSend = async () => {
    if (!canSend) return;
    setIsSending(true);
    setSendMessage('');
    try {
      await sendCode(email);
      setIsSent(true);
      setSendMessage('인증번호가 이메일로 발송되었습니다.');
    } catch (error) {
      setSendMessage(error instanceof Error ? error.message : '인증번호 발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!canVerify) return;
    setIsVerifying(true);
    setCodeMessage('');
    try {
      const verified = await verifyCode(email, code);
      if (verified) {
        setIsVerified(true);
        setCodeMessage('이메일 인증이 완료되었습니다!');
      } else {
        setCodeMessage('인증번호를 확인해주세요.');
      }
    } catch (error) {
      setCodeMessage(error instanceof Error ? error.message : '인증번호 확인에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  return {
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
  };
}

export type UseEmailVerificationResult = ReturnType<typeof useEmailVerification>;
