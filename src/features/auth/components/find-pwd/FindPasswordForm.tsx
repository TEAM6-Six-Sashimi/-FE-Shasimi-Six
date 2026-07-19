'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { sendEmailVerification, verifyEmailCode, resetPassword } from '@/services/auth.service';
import { useEmailVerification } from '@/features/auth/hooks/useEmailVerification';
import EmailVerifyField from '@/features/auth/components/EmailVerifyField';
import PasswordFields, {
  PASSWORD_REGEX,
} from '@/features/auth/components/signupform/fields/Passwordfield';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

export default function FindPasswordForm() {
  const router = useRouter();

  const [loginId, setLoginId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const verification = useEmailVerification({
    sendCode: async (email) => {
      if (!loginId.trim()) {
        throw new Error('아이디를 입력해 주세요.');
      }
      await sendEmailVerification(email, 'PASSWORD_RESET');
    },
    verifyCode: (email, code) => verifyEmailCode(email, code, 'PASSWORD_RESET'),
  });

  const isLoginIdValid = loginId.trim() !== '';
  const isPasswordFormatValid = PASSWORD_REGEX.test(newPassword);
  const canSubmit =
    isLoginIdValid &&
    verification.isVerified &&
    isPasswordFormatValid &&
    isPasswordMatched &&
    !isSubmitting;

  const inputCls = (error: boolean) =>
    `w-full h-11 px-4 rounded-lg border text-[15px] placeholder:text-[#6A7282] outline-none transition-colors ${
      error ? 'border-[#FF5F5F]' : 'border-[#D1D5DB]'
    }`;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await resetPassword({
        email: verification.email,
        code: verification.code,
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
          disabled={verification.isVerified}
          placeholder="아이디를 입력하세요."
          className={inputCls(false)}
        />
      </div>

      <EmailVerifyField verification={verification} inputHeightClass="h-11" />

      {verification.isVerified && (
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
              labelVariant="medium"
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
