'use client';

import { useState } from 'react';
import StepIndicator from './StepIndicator';
import Step01Introduction from './Step01Introduction';
import Step02Career from './Step02Career';
import Step03Documents from './Step03Documents';
import { UserMe } from '@/features/auth/types';
import OneButtonModal from '@/components/modals/OneButtonModal';
import { useRouter } from 'next/navigation';

const STEPS = [{ label: '자기소개' }, { label: '경력 및 전문성' }, { label: '서류 제출' }];

const DEFAULT_STEP01 = {
  motivation: '',
  introduction: '',
  equipment: [] as string[],
};

const DEFAULT_STEP02 = {
  job: '',
  yearsOfExperience: '',
  hasOnlineExperience: null as boolean | null,
  platformName: '',
  studentCount: '',
  reviewLink: '',
  certifications: [] as { name: string; file: File }[],
  channelLink: '',
};

const DEFAULT_STEP03 = {
  resumeFile: null as File | null,
  // portfolioFile: null as File | null,
  curriculumFile: null as File | null,
  portfolioUrl: '',
  sampleVideoLink: '',
};

interface InstructorApplicationClientProps {
  userInfo: UserMe;
}

export default function InstructorApplicationClient({ userInfo }: InstructorApplicationClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [step01Data, setStep01Data] = useState(DEFAULT_STEP01);
  const [step02Data, setStep02Data] = useState(DEFAULT_STEP02);
  const [step03Data, setStep03Data] = useState(DEFAULT_STEP03);
  const [resultModal, setResultModal] = useState<{
    title: string;
    message: string;
    isSuccess: boolean;
  } | null>(null);

  const handleStep01Next = (data: typeof DEFAULT_STEP01) => {
    setStep01Data(data);
    setStep(2);
  };

  const handleStep02Next = (data: typeof DEFAULT_STEP02) => {
    setStep02Data(data);
    setStep(3);
  };

  const handleSubmit = async (data: typeof DEFAULT_STEP03) => {
    setStep03Data(data);

    const certFiles = step02Data.certifications.map((c) => c.file);
    if (certFiles.length === 0) {
      setResultModal({
        title: '자격증 필요',
        message: '자격증 파일이 없습니다.',
        isSuccess: false,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('bio', step01Data.introduction);
      formData.append('portfolioUrl', data.portfolioUrl);
      certFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/instructor-apply', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '강사 지원에 실패했습니다.');
      }

      setResultModal({
        title: '지원 완료',
        message: `강사 지원이 완료되었습니다!\n검토 후 이메일로 결과를 안내드립니다.`,
        isSuccess: true,
      });
    } catch (error: any) {
      setResultModal({
        title: '지원 실패',
        message: error.message || '강사 지원에 실패했습니다.',
        isSuccess: false,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#1E2125]">강사 지원</h1>
        <p className="text-[13.5px] text-[#6A7282] mt-1">
          우리 플랫폼의 강사가 되어 여러분의 지식을 공유해주세요
        </p>
      </div>

      <StepIndicator currentStep={step} steps={STEPS} />

      <div className="bg-white rounded-2xl shadow-md p-8">
        {step === 1 && (
          <Step01Introduction userInfo={userInfo} data={step01Data} onNext={handleStep01Next} />
        )}
        {step === 2 && (
          <Step02Career data={step02Data} onNext={handleStep02Next} onPrev={() => setStep(1)} />
        )}
        {step === 3 && (
          <Step03Documents data={step03Data} onSubmit={handleSubmit} onPrev={() => setStep(2)} />
        )}
      </div>

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