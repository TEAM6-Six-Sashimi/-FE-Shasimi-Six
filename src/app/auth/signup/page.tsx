'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/features/user/instructor-application/_components/StepIndicator';
import Signup01Introduction from '@/features/auth/components/signupform/Signup01Introduction';
import Signup02Interests from '@/features/auth/components/signupform/Signup02Interests';
import { registerUser } from '@/services/auth.service';
import { SignupFormData, SignupStatusData, SignupPayloadDto } from '@/features/auth/types';
import { AgreementState } from '@/features/auth/components/signupform/fields/Agreementsfield';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import OneButtonModal from '@/components/modals/OneButtonModal';

const STEPS = [
  { id: 1, label: '회원정보 입력' },
  { id: 2, label: '관심 카테고리' },
];

type ModalState = 'none' | 'success' | 'fail';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [modalState, setModalState] = useState<ModalState>('none');

  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    birth_date: '',
    phone: '',
    email: '',
    login_id: '',
    password: '',
    passwordConfirm: '',
  });

  const [statusData, setStatusData] = useState<SignupStatusData>({
    email_verified: false,
    isIdChecked: false,
    isIdAvailable: false,
    isVerificationSent: false,
  });

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [referralCode, setReferralCode] = useState<string>('');
  const [isReferralChecked, setIsReferralChecked] = useState<boolean>(false);

  const nextStep = (updatedForm: SignupFormData, updatedStatus: SignupStatusData) => {
    setFormData(updatedForm);
    setStatusData(updatedStatus);
    setStep((prev) => prev + 1);
  };

  const prevStep = (
    updatedCategories: number[],
    updatedReferral: string,
    updatedReferralChecked: boolean,
  ) => {
    setSelectedCategories(updatedCategories);
    setReferralCode(updatedReferral);
    setIsReferralChecked(updatedReferralChecked);
    setStep((prev) => prev - 1);
  };

  // 회원가입 제출 버튼
  const handleSignupSubmit = async (
    finalCategoryIds: number[],
    finalReferralCode: string,
    agreements: AgreementState,
  ) => {
    const finalPayload: SignupPayloadDto = {
      loginId: formData.login_id,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      birthDate: formData.birth_date,
      interestCategoryIds: finalCategoryIds,
      referralCode: finalReferralCode || null,
      marketingConsent: agreements.marketing,
      emailConsent: agreements.emailNotice,
      aiConsent: agreements.aiUsage,
    };

    try {
      const success = await registerUser(finalPayload);
      setModalState(success ? 'success' : 'fail');
    } catch {
      setModalState('fail');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-full min-h-[calc(100vh-48px)] py-10 px-4 bg-[#F9FAFB]">
        <StepIndicator currentStep={step} steps={STEPS} />
        <div className="bg-white w-full max-w-xl rounded-2xl p-10 shadow-md">
          <div className="text-[29px] font-bold text-center mb-8">회원가입</div>
          {step === 1 && (
            <Signup01Introduction
              initialFormData={formData}
              initialStatusData={statusData}
              onNext={nextStep}
            />
          )}
          {step === 2 && (
            <Signup02Interests
              initialCategories={selectedCategories}
              initialReferralCode={referralCode}
              initialReferralChecked={isReferralChecked}
              onPrev={prevStep}
              onSubmit={handleSignupSubmit}
            />
          )}
        </div>
      </div>
      {modalState === 'success' && (
        <TwoButtonModal
          title="회원가입 완료"
          message={'회원가입이 성공적으로 완료되었습니다.\n로그인 페이지로 이동하시겠습니까?'}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => router.push('/auth/login')}
          onCancel={() => router.push('/')}
        />
      )}
      {/* 회원가입 실패 */}
      {modalState === 'fail' && (
        <OneButtonModal
          title="회원가입 실패"
          message="서버 검증 에러 또는 데이터 처리로 인해 회원가입에 실패했습니다."
          onConfirm={() => setModalState('none')}
        />
      )}
    </>
  );
}
