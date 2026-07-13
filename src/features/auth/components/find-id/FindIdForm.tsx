'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { sendFindIdVerification, confirmFindId } from '@/services/auth.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FindIdForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sendError, setSendError] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  // 인증번호 확인 API 응답으로 받아둔 아이디 - [아이디 찾기] 클릭 시 모달로 보여주기
  const [confirmedLoginId, setConfirmedLoginId] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(email);
  const canSend = !!name.trim() && isEmailValid && !isSending && !isSent;

  const handleSendCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!canSend) return;

    setIsSending(true);
    setSendError('');
    try {
      await sendFindIdVerification(name.trim(), email.trim());
      setIsSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : '인증번호 발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!code.trim() || isVerifying || isVerified) return;

    setIsVerifying(true);
    setVerifyError('');
    try {
      const result = await confirmFindId(name.trim(), email.trim(), code.trim());
      setConfirmedLoginId(result.loginId);
      setIsVerified(true);
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : '인증번호 확인에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  // 확인 단계에서 받아둔 아이디를 모달로 보여주기(API 재호출 없음)
  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified || !confirmedLoginId) return;
    setShowResultModal(true);
  };

  return (
    <>
      <form onSubmit={handleFindId}>
        <fieldset>
          <div className="flex">
            <label htmlFor="name" className="font-medium mb-2 text-[15px]">
              이름
            </label>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <input
            id="name"
            type="text"
            placeholder="이름을 입력해 주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSent || isSending}
            className="w-full h-11 px-4 mb-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282] disabled:bg-[#F9FAFB] disabled:text-[#6A7282]"
          />
        </fieldset>

        <fieldset>
          <div className="flex">
            <label htmlFor="email" className="font-medium mb-2 text-[15px]">
              이메일
            </label>
            <p className="text-[#FF5F5F]">*</p>
          </div>
          <div className="flex gap-1.5 mb-4">
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSent || isSending}
              className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282] disabled:bg-[#F9FAFB] disabled:text-[#6A7282]"
            />
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={!canSend}
              className={`h-11 px-4 text-[13px] font-medium whitespace-nowrap cursor-pointer ${
                isSent || isSending
                  ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                  : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
              }`}
            >
              {isSending ? '발송 중' : isSent ? '발송됨' : '인증번호 발송'}
            </Button>
          </div>

          {sendError && (
            <p className="text-[13px] text-red-500 font-medium mb-4 -mt-2">⚠ {sendError}</p>
          )}

          {isSent && (
            <div>
              <div className="flex">
                <label htmlFor="email" className="font-medium mb-2 text-[15px]">
                  인증번호
                </label>
                <p className="text-[#FF5F5F]">*</p>
              </div>
              <div className="flex gap-1.5 mb-4">
                <input
                  type="text"
                  placeholder="인증번호 8자리"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isVerified || isVerifying}
                  className="w-full h-11 px-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282] disabled:bg-[#F9FAFB] disabled:text-[#6A7282]"
                />
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!code.trim() || isVerified || isVerifying}
                  className={`h-11 px-4 text-[13px] font-medium whitespace-nowrap cursor-pointer ${
                    isVerified || isVerifying
                      ? 'bg-[#FFEBEB] text-[#FF5F5F] cursor-not-allowed'
                      : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
                  }`}
                >
                  {isVerifying ? '확인 중' : isVerified ? '확인됨' : '확인'}
                </Button>
              </div>

              {verifyError && (
                <p className="text-[13px] text-red-500 font-medium mb-4">⚠ {verifyError}</p>
              )}
            </div>
          )}
        </fieldset>

        <Button
          type="submit"
          disabled={!isVerified}
          className={`w-full py-3 h-auto text-[19px] rounded-lg font-semibold mt-2 transition-all cursor-pointer ${
            isVerified
              ? 'bg-[#FF5F5F] hover:bg-[#D14848] text-white'
              : 'bg-gray-400 cursor-not-allowed text-white'
          }`}
        >
          아이디 찾기
        </Button>
      </form>

      {showResultModal && confirmedLoginId && (
        <TwoButtonModal
          title="아이디 찾기"
          message={`귀하의 아이디는 ${confirmedLoginId} 입니다.`}
          confirmLabel="로그인 화면으로"
          cancelLabel="비밀번호 찾기"
          onConfirm={() => router.push('/auth/login')}
          onCancel={() => router.push('/auth/find-pwd')}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </>
  );
}
