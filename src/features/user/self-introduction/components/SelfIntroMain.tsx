'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';
import ResumeLoginInfo from '@/features/user/resume/sections/ResumeLoginInfo';
import { saveCoverLetterAction } from '../actions';
import {
  CoverLetterResponse,
  SelfIntroductionFormData,
  SELF_INTRODUCTION_QUESTIONS,
  toFormData,
  toSavePayload,
} from '../types';

interface SelfIntroMainProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedCoverLetter: CoverLetterResponse | null;
  isLoggedIn: boolean;
}

export default function SelfIntroMain({
  userName,
  userPhone,
  userEmail,
  savedCoverLetter,
  isLoggedIn,
}: SelfIntroMainProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const initial = useMemo(() => toFormData(savedCoverLetter?.items), [savedCoverLetter]);

  const [form, setForm] = useState<SelfIntroductionFormData>(initial);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() => JSON.stringify(initial));
  const [isSaving, setIsSaving] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const currentSnapshot = JSON.stringify(form);
  const isDirty = currentSnapshot !== lastSavedSnapshot;
  const hasAnyContent = Object.values(form).some((value) => value.trim() !== '');
  const canSave = hasAnyContent && isDirty;

  const updateField = (key: keyof SelfIntroductionFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!canSave || isSaving) return;

    // 로그인 여부 확인
    if (!isLoggedIn) {
      setShowLoginRequiredModal(true);
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveCoverLetterAction(toSavePayload(form));

      if (result.success) {
        setLastSavedSnapshot(currentSnapshot);
        showToast('자기소개서가 저장되었습니다.');
      } else if (result.authError) {
        showToast(result.message ?? '다른 기기에서 로그인되어 자동 로그아웃 되었습니다.', 'alarm');
        await logoutAction();
        return;
      } else {
        showToast(result.message ?? '자기소개서 저장에 실패했습니다.', 'negative');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-6"
      >
        <h2 className="text-[20px] font-extrabold mt-2 text-[#1E2125]">자기소개서 작성</h2>

        {/* 로그인 정보 */}
        <ResumeLoginInfo userName={userName} userPhone={userPhone} userEmail={userEmail} />

        {SELF_INTRODUCTION_QUESTIONS.map((question, idx) => (
          <div key={question.key}>
            {idx > 0 && <hr className="border-[#E5E7EB] mb-6" />}
            <h3 className="text-[15px] font-bold text-[#1E2125] mb-3">{question.label}</h3>
            <textarea
              value={form[question.key]}
              onChange={(e) => updateField(question.key, e.target.value)}
              placeholder={question.placeholder}
              maxLength={question.maxLength}
              rows={6}
              className="w-full px-3 py-3.5 border border-[#D1D5DB] rounded-lg placeholder-[#9CA3AF] text-[14px] text-[#1E2125] outline-none focus:border-[#1E2125] transition-colors resize-none"
            />
            <p className="text-[12px] text-[#9CA3AF] text-right mt-1">
              {form[question.key].length}/{question.maxLength}
            </p>
          </div>
        ))}

        <Button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className={`w-full h-11 font-semibold text-[14px] cursor-pointer transition-colors ${
            canSave && !isSaving
              ? 'bg-[#FF5E5E] hover:bg-[#D14848] text-white'
              : 'bg-[#FFEBEB] text-[#FF5E5E] cursor-not-allowed'
          }`}
        >
          {isSaving ? '저장 중' : '저장하기'}
        </Button>
      </form>

      {/* 로그인 필요 모달 */}
      {showLoginRequiredModal && (
        <TwoButtonModal
          title="로그인이 필요합니다"
          message={`로그인 후 이용할 수 있는 기능입니다.\n로그인 페이지로 이동하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowLoginRequiredModal(false);
            router.push('/auth/login');
          }}
          onCancel={() => setShowLoginRequiredModal(false)}
        />
      )}
    </>
  );
}
