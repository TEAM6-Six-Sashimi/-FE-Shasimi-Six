'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from './StepIndicator';
import Step01Introduction, { Step01Data } from './Step01Introduction';
import Step02Documents, { Step02Data } from './Step02Documents';
import { UserMe } from '@/features/auth/types';
import { Category } from '@/features/categories/types';
import OneButtonModal from '@/components/modals/OneButtonModal';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import FullScreenLoading from '@/components/ui/FullScreenLoading';
import { useMaintenance } from '@/components/system/MaintenanceProvider';

const STEPS = [{ label: '강사 정보' }, { label: '서류 제출' }];

const DEFAULT_STEP01: Step01Data = {
  profileImage: null,
  introduction: '',
  motivation: '',
  categoryId: null,
};

const DEFAULT_STEP02: Step02Data = {
  certifications: [],
  resumeFile: null,
  portfolioUrl: '',
  agreePrivacy: false,
  agreePublicProfile: false,
};

interface InstructorApplicationClientProps {
  userInfo: UserMe;
  categories: Category[];
  hasPendingApplication: boolean;
}

export default function InstructorApplicationClient({
  userInfo,
  categories,
  hasPendingApplication,
}: InstructorApplicationClientProps) {
  const router = useRouter();
  const { setMaintenance } = useMaintenance();
  const [showPendingModal, setShowPendingModal] = useState(hasPendingApplication);
  const [step, setStep] = useState(1);
  const [step01Data, setStep01Data] = useState<Step01Data>(DEFAULT_STEP01);
  const [step02Data, setStep02Data] = useState<Step02Data>(DEFAULT_STEP02);
  const [resultModal, setResultModal] = useState<{
    title: string;
    message: string;
    isSuccess: boolean;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep01Next = (data: Step01Data) => {
    setStep01Data(data);
    setStep(2);
  };

  const handleSubmit = async (data: Step02Data) => {
    setStep02Data(data);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('introduction', step01Data.introduction);
      formData.append('motivation', step01Data.motivation);
      formData.append('categoryId', String(step01Data.categoryId));
      if (step01Data.profileImage) {
        formData.append('profileImage', step01Data.profileImage);
      }
      formData.append('portfolioUrl', data.portfolioUrl);
      if (data.resumeFile) {
        formData.append('resume', data.resumeFile);
      }
      data.certifications.forEach((c) => {
        formData.append('files', c.file);
      });

      const res = await fetch('/api/instructor-apply', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (errorData.maintenance) {
          setMaintenance(true, errorData.error);
          return;
        }
        if (errorData.alreadyApplied) {
          setResultModal({
            title: '이미 지원 내역이 있습니다',
            message:
              '이미 강사 지원 신청이 접수되어 있습니다.\n지원 결과는 마이페이지 > 강사 지원 내역에서 확인해주세요.',
            isSuccess: true,
          });
          return;
        }
        throw new Error(errorData.error || '강사 지원에 실패했습니다.');
      }

      setResultModal({
        title: '강사 지원이 완료되었습니다!',
        message:
          '결과는 사내 평가 후 이메일을 통해\n일주일 이내에 발송됩니다.\n내역의 경우 마이페이지 > 강사 지원 내역 페이지에서 확인 가능합니다',
        isSuccess: true,
      });
    } catch (error) {
      setResultModal({
        title: '지원 실패',
        message: error instanceof Error ? error.message : '강사 지원에 실패했습니다.',
        isSuccess: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#1E2125] text-center">강사 지원</h1>
        <p className="text-[13.5px] text-[#6A7282] text-center mt-1">
          핏격의 강사가 되어 여러분의 지식을 공유해주세요
        </p>
      </div>

      <StepIndicator currentStep={step} steps={STEPS} />

      <div className="bg-white rounded-2xl shadow-md p-8">
        {step === 1 && (
          <Step01Introduction
            userInfo={userInfo}
            categories={categories}
            data={step01Data}
            onNext={handleStep01Next}
          />
        )}
        {step === 2 && (
          <Step02Documents data={step02Data} onSubmit={handleSubmit} onPrev={() => setStep(1)} />
        )}
      </div>

      {isSubmitting && <FullScreenLoading message="강사 지원서를 제출하는 중입니다..." />}

      {/* 심사 중 안내 모달 - 대기 중인 지원서가 있으면 진입 즉시 노출 */}
      {showPendingModal && (
        <TwoButtonModal
          title="강사 지원 심사 중"
          message={
            '이미 제출한 강사 지원서가 심사 중입니다.\n결과가 나올 때까지 재지원하실 수 없습니다.'
          }
          confirmLabel="지원 내역 확인하기"
          cancelLabel="홈으로"
          onConfirm={() => {
            setShowPendingModal(false);
            router.push('/mypage/instructor-application-list');
          }}
          onCancel={() => {
            setShowPendingModal(false);
            router.push('/');
          }}
        />
      )}

      {/* 결과 모달 */}
      {resultModal && (
        <OneButtonModal
          title={resultModal.title}
          message={resultModal.message}
          confirmLabel="확인"
          onConfirm={() => {
            setResultModal(null);
            if (resultModal.isSuccess) router.push('/');
          }}
        />
      )}
    </div>
  );
}
