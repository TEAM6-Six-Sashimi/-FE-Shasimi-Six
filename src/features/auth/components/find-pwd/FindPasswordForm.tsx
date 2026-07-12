'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { sendEmailVerification, verifyEmailCode, resetPassword } from '@/services/auth.service';
import PasswordFields, {
  PASSWORD_REGEX,
} from '@/features/auth/components/signupform/fields/Passwordfield';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_MAX_LENGTH = 8;

export default function FindPasswordForm() {
  const router = useRouter();

  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sendMessage, setSendMessage] = useState('');

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [codeMessage, setCodeMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const isLoginIdValid = loginId.trim() !== '';
  const isEmailValid = EMAIL_REGEX.test(email);
  const canSend = isLoginIdValid && isEmailValid && !isSending;
  const canVerify = code.trim() !== '' && !isVerifying;
  const isPasswordFormatValid = PASSWORD_REGEX.test(newPassword);
  const canSubmit = isVerified && isPasswordFormatValid && isPasswordMatched && !isSubmitting;

  const inputCls = (error: boolean) =>
    `w-full h-11 px-4 rounded-lg border text-[15px] placeholder:text-[#6A7282] outline-none transition-colors ${
      error ? 'border-[#FF5F5F]' : 'border-[#D1D5DB]'
    }`;

  const handleSend = async () => {
    if (!canSend) return;
    setIsSending(true);
    setSendMessage('');
    try {
      await sendEmailVerification(email, 'PASSWORD_RESET');
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
      const verified = await verifyEmailCode(email, code, 'PASSWORD_RESET');
      if (verified) {
        setIsVerified(true);
      } else {
        setCodeMessage('인증번호를 확인해주세요.');
      }
    } catch (error) {
      setCodeMessage(error instanceof Error ? error.message : '인증번호 확인에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await resetPassword({
        email,
        code,
        newPassword,
        newPasswordConfirm,
        newPasswordMatched: isPasswordMatched,
      });

      if (result.passwordReset) {
        setShowCompleteModal(true);
      } else {
        setSubmitError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <div className="flex">
          <label className="block font-medium mb-2 text-[15px]">아이디</label>
          <p className="text-[#FF5F5F]">*</p>
        </div>
        <input
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          disabled={isSent}
          placeholder="아이디를 입력하세요."
          className={inputCls(false)}
        />
      </div>

      <div className="mb-4">
        <div className="flex">
          <label className="block font-medium mb-2 text-[15px]">이메일</label>
          <p className="text-[#FF5F5F]">*</p>
        </div>
        <div className="flex gap-1.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSent}
            placeholder="example@email.com"
            className={inputCls(email !== '' && !isEmailValid)}
          />
          <Button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`px-3 h-11 text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
              isSent
                ? 'bg-[#FFEBEB] text-[#FF5F5F] hover:bg-[#FFDBDB]'
                : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
            }`}
          >
            {isSending ? '발송 중...' : isSent ? '재발송' : '인증번호 발송'}
          </Button>
        </div>
        {sendMessage && <p className="text-xs mt-1 font-medium text-[#6A7282]">{sendMessage}</p>}
      </div>

      {isSent && (
        <div className="mb-4">
          <div className="flex">
            <label className="block font-medium mb-2 text-[15px]">인증번호</label>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, CODE_MAX_LENGTH))}
              disabled={isVerified}
              placeholder="인증번호를 입력해주세요"
              className={inputCls(!!codeMessage)}
            />
            <Button
              type="button"
              onClick={handleVerify}
              disabled={!canVerify || isVerified}
              className={`px-4 h-11 text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
                isVerified
                  ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                  : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
              }`}
            >
              {isVerifying ? '확인 중...' : isVerified ? '인증완료' : '확인'}
            </Button>
          </div>
          {codeMessage && (
            <p className="text-[14px] text-red-500 font-medium mt-1 pl-1">⚠ {codeMessage}</p>
          )}
          {isVerified && (
            <p className="text-xs mt-1 font-medium text-[#5C7A00]">인증이 완료되었습니다!</p>
          )}
        </div>
      )}

      {isVerified && (
        <>
          <div className="mt-6">
            <PasswordFields
              password={newPassword}
              onPasswordChange={setNewPassword}
              passwordConfirm={newPasswordConfirm}
              onPasswordConfirmChange={setNewPasswordConfirm}
              onMatchedChange={setIsPasswordMatched}
              label="새 비밀번호"
              confirmLabel="새 비밀번호 확인"
              inputHeightClass="h-11"
            />
          </div>

          {submitError && (
            <p className="text-[14px] text-red-500 mb-4 font-medium pl-1">⚠ {submitError}</p>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-3 h-11 text-[19px] rounded-lg text-white font-semibold mb-2 transition-all cursor-pointer ${
              !canSubmit
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-[#FF5F5F] hover:bg-[#D14848] active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? '변경 중' : '변경하기'}
          </Button>
        </>
      )}

      {showCompleteModal && (
        <TwoButtonModal
          title="비밀번호 찾기"
          message={'비밀번호 변경이 완료되었습니다.\n로그인 화면으로 이동하시겠습니까?'}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowCompleteModal(false);
            router.push('/auth/login');
          }}
          onCancel={() => {
            setShowCompleteModal(false);
            router.push('/');
          }}
        />
      )}
    </>
  );
}
