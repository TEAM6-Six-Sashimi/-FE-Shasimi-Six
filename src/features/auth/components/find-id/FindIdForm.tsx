'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { sendFindIdVerification, confirmFindId } from '@/services/auth.service';
import { useEmailVerification } from '@/features/auth/hooks/useEmailVerification';
import EmailVerifyField from '@/features/auth/components/EmailVerifyField';

export default function FindIdForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  // 인증번호 확인 API 응답으로 받아둔 아이디 -> [아이디 찾기] 클릭 시 모달로 보여주기
  const [confirmedLoginId, setConfirmedLoginId] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const verification = useEmailVerification({
    sendCode: async (email) => {
      if (!name.trim()) {
        throw new Error('이름을 입력해 주세요.');
      }
      await sendFindIdVerification(name.trim(), email);
    },
    verifyCode: async (email, code) => {
      const result = await confirmFindId(name.trim(), email, code);
      setConfirmedLoginId(result.loginId);
      return true;
    },
  });

  // 확인 단계에서 받아둔 아이디를 모달로 보여주기
  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verification.isVerified || !confirmedLoginId) return;
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
            disabled={verification.isVerified}
            className="w-full h-11 px-4 mb-4 border border-[#D1D5DB] rounded-lg placeholder-[#6A7282] disabled:bg-[#F9FAFB] disabled:text-[#6A7282]"
          />
        </fieldset>

        <EmailVerifyField verification={verification} inputHeightClass="h-11" />

        <Button
          type="submit"
          disabled={!verification.isVerified}
          className={`w-full py-3 h-auto text-[19px] rounded-lg font-semibold mt-2 transition-all cursor-pointer ${
            verification.isVerified
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
