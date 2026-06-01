'use client';

import { useState } from 'react';
import StepIndicator from './StepIndicator';
import Step01Introduction from './Step01Introduction';
import Step02Career from './Step02Career';
import Step03Documents from './Step03Documents';
import { UserMe } from '@/features/auth/types';

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

export default function InstructorApplicationClient({
  userInfo,
}: InstructorApplicationClientProps) {
  const [step, setStep] = useState(1);
  const [step01Data, setStep01Data] = useState(DEFAULT_STEP01);
  const [step02Data, setStep02Data] = useState(DEFAULT_STEP02);
  const [step03Data, setStep03Data] = useState(DEFAULT_STEP03);

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
      alert('자격증 파일이 없습니다.');
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

      alert('강사 지원이 완료되었습니다!');
    } catch (error: any) {
      alert(error.message || '강사 지원에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* 타이틀 */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#1E2125]">강사 지원</h1>
        <p className="text-[13.5px] text-[#6A7282] mt-1">
          우리 플랫폼의 강사가 되어 여러분의 지식을 공유해주세요
        </p>
      </div>

      {/* 단계 표시기 */}
      <StepIndicator currentStep={step} steps={STEPS} />

      {/* 폼 카드 */}
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
    </div>
  );
}
