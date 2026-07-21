'use client';

import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { SavedResume } from '../types';
import { useResumeForm } from '../hooks/useResumeForm';
import ResumeLoginInfo from '../sections/ResumeLoginInfo';
import EducationSection from '../sections/EducationSection';
import CareerSection from '../sections/CareerSection';
import CertificationSection from '../sections/CertificationSection';

interface ResumeMainProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedResume: SavedResume | null;
  isLoggedIn: boolean;
  onSavedStateChange?: (isSaved: boolean, resumeId: number | null) => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}

export default function ResumeMain({
  userName,
  userPhone,
  userEmail,
  savedResume,
  isLoggedIn,
  onSavedStateChange,
  onDirtyStateChange,
}: ResumeMainProps) {
  const {
    router,
    educations,
    educationError,
    addEducation,
    removeEducation,
    updateEducation,
    handleEducationDateChange,
    careers,
    isNewGraduate,
    careerError,
    addCareer,
    removeCareer,
    updateCareer,
    handleCareerDateChange,
    handleNewGraduateToggle,
    certifications,
    certificationError,
    addCertification,
    removeCertification,
    updateCertification,
    handleCertificationDateChange,
    handleSave,
    isSaving,
    canSave,
    showLoginRequiredModal,
    setShowLoginRequiredModal,
  } = useResumeForm({ savedResume, isLoggedIn, onSavedStateChange, onDirtyStateChange });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-6"
      >
        <h2 className="text-[20px] font-extrabold mt-2 text-[#1E2125]">이력서 작성</h2>

        {/* 로그인 정보 */}
        <ResumeLoginInfo userName={userName} userPhone={userPhone} userEmail={userEmail} />

        <hr className="border-[#E5E7EB]" />

        {/* ─────────────── 학력 사항 ─────────────── */}
        <EducationSection
          educations={educations}
          error={educationError}
          onAdd={addEducation}
          onRemove={removeEducation}
          onUpdate={updateEducation}
          onDateChange={handleEducationDateChange}
        />

        <hr className="border-[#E5E7EB]" />

        {/* ─────────────── 경력 사항 ─────────────── */}
        <CareerSection
          careers={careers}
          isNewGraduate={isNewGraduate}
          error={careerError}
          onAdd={addCareer}
          onRemove={removeCareer}
          onUpdate={updateCareer}
          onDateChange={handleCareerDateChange}
          onNewGraduateToggle={handleNewGraduateToggle}
        />

        <hr className="border-[#E5E7EB]" />

        {/* ─────────────── 보유 기술 및 자격증 ─────────────── */}
        <CertificationSection
          certifications={certifications}
          error={certificationError}
          onAdd={addCertification}
          onRemove={removeCertification}
          onUpdate={updateCertification}
          onDateChange={handleCertificationDateChange}
        />

        <Button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className={`w-full h-11 font-semibold text-[14px] cursor-pointer transition-colors ${
            canSave && !isSaving
              ? 'bg-[#FF5E5E] hover:bg-[#D14848] text-white'
              : 'bg-[#FFEBEB] text-[#FF5E5E] cursor-not-allowed'
          }`}
        >
          {isSaving ? '저장 중...' : '저장하기'}
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
