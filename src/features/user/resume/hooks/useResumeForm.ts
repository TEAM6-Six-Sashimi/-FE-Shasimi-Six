'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { useMaintenance } from '@/components/system/MaintenanceProvider';
import {
  CareerItem,
  CertificationItem,
  CertificationType,
  DegreeType,
  EducationItem,
  EmploymentType,
  GraduationStatus,
  ResumePayload,
  SavedResume,
} from '../types';
import { saveResumeAction, updateResumeAction } from '../actions';
import { logoutAction } from '@/features/auth/actions';
import { formatYearMonth, formatYearMonthDay } from '@/lib/utils';
import { getCareerError, getCertificationError, getEducationError } from '../validation';

// 임시 id 생성용
function generateTempId() {
  return Math.random().toString(36).slice(2, 10);
}

// SavedResume → 프론트 폼 상태로 변환 (id 부여, null 값들은 빈 문자열로 변환)
function toFormState(saved: SavedResume) {
  return {
    educations: saved.educations.map((e) => ({
      ...e,
      id: generateTempId(),
      minorOrResearch: e.minorOrResearch ?? '',
    })) as EducationItem[],
    isNewGraduate: saved.entryLevel,
    careers: saved.careers.map((c) => ({
      ...c,
      id: generateTempId(),
      customEmploymentType: c.customEmploymentType ?? '',
      endYearMonth: c.endYearMonth ?? '',
    })) as CareerItem[],
    certifications: saved.certifications.map((cert) => ({
      ...cert,
      id: generateTempId(),
      scoreOrGrade: cert.scoreOrGrade ?? '',
    })) as CertificationItem[],
  };
}

interface UseResumeFormParams {
  savedResume: SavedResume | null;
  isLoggedIn: boolean;
  onSavedStateChange?: (isSaved: boolean, resumeId: number | null) => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}

// 이력서 작성 폼의 상태/검증/저장 로직
export function useResumeForm({
  savedResume,
  isLoggedIn,
  onSavedStateChange,
  onDirtyStateChange,
}: UseResumeFormParams) {
  const router = useRouter();
  const { showToast } = useToast();
  const { setMaintenance } = useMaintenance();
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  // 저장된 이력서가 있으면 그 값으로, 없으면 빈 배열로 초기화
  const initial = savedResume ? toFormState(savedResume) : null;

  const [educations, setEducations] = useState<EducationItem[]>(initial?.educations ?? []);
  const [isNewGraduate, setIsNewGraduate] = useState(initial?.isNewGraduate ?? false);
  const [careers, setCareers] = useState<CareerItem[]>(initial?.careers ?? []);
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    initial?.certifications ?? [],
  );

  // 저장 상태 추적 - 기존 이력서가 있으면 resumeId를 바로 채워서 "수정 모드"로 시작
  const [resumeId, setResumeId] = useState<number | null>(savedResume?.resumeId ?? null);

  const initialSnapshot = useMemo(
    () => JSON.stringify({ educations, isNewGraduate, careers, certifications }),
    [], // 최초 마운트 시점 값으로 고정
  );
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>(initialSnapshot);
  const [isSaving, setIsSaving] = useState(false);

  const currentSnapshot = useMemo(
    () => JSON.stringify({ educations, isNewGraduate, careers, certifications }),
    [educations, isNewGraduate, careers, certifications],
  );

  const isDirty = currentSnapshot !== lastSavedSnapshot;
  const isSaved = resumeId !== null;
  // 새로 작성됐거나 수정이 감지된 경우 저장하기 버튼 활성화
  const canSave = !isSaved || isDirty;

  // 섹션별 필수 입력 검증 에러 메시지
  const [educationError, setEducationError] = useState('');
  const [careerError, setCareerError] = useState('');
  const [certificationError, setCertificationError] = useState('');

  useEffect(() => {
    onSavedStateChange?.(isSaved && !isDirty, resumeId);
  }, [isSaved, isDirty, resumeId, onSavedStateChange]);

  useEffect(() => {
    onDirtyStateChange?.(isDirty);
  }, [isDirty, onDirtyStateChange]);

  // 학력 사항
  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: generateTempId(),
        schoolName: '',
        startYearMonth: '',
        endYearMonth: '',
        graduationStatus: '',
        major: '',
        degree: '',
        minorOrResearch: '',
      },
    ]);
  };

  const removeEducation = (id: string) => {
    setEducations((prev) => prev.filter((item) => item.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setEducations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
    if (educationError) setEducationError('');
  };

  // 날짜(YYYY-MM) 자동 하이픈 적용 핸들러
  const handleEducationDateChange = (
    id: string,
    field: 'startYearMonth' | 'endYearMonth',
    value: string,
  ) => {
    updateEducation(id, field, formatYearMonth(value));
  };

  // 경력 사항
  const addCareer = () => {
    setCareers((prev) => [
      ...prev,
      {
        id: generateTempId(),
        companyName: '',
        startYearMonth: '',
        endYearMonth: '',
        currentlyEmployed: false,
        employmentType: '',
        customEmploymentType: '',
        jobTitle: '',
      },
    ]);
  };

  const updateCareer = (id: string, field: keyof CareerItem, value: string | boolean) => {
    setCareers((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    if (careerError) setCareerError('');
  };

  const handleCareerDateChange = (
    id: string,
    field: 'startYearMonth' | 'endYearMonth',
    value: string,
  ) => {
    updateCareer(id, field, formatYearMonth(value));
  };

  // 신입 체크 시 기존 경력 입력값 초기화 (+ 버튼도 숨김)
  const handleNewGraduateToggle = () => {
    setIsNewGraduate((prev) => {
      const next = !prev;
      if (next) setCareers([]);
      return next;
    });
    if (careerError) setCareerError('');
  };

  // 자격증
  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      {
        id: generateTempId(),
        type: '',
        name: '',
        issuer: '',
        acquiredDate: '',
        scoreOrGrade: '',
      },
    ]);
  };

  const updateCertification = (id: string, field: keyof CertificationItem, value: string) => {
    setCertifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
    if (certificationError) setCertificationError('');
  };

  const handleCertificationDateChange = (id: string, value: string) => {
    updateCertification(id, 'acquiredDate', formatYearMonthDay(value));
  };

  const removeCertification = (id: string) => {
    setCertifications((prev) => prev.filter((item) => item.id !== id));
  };

  const removeCareer = (id: string) => {
    setCareers((prev) => prev.filter((item) => item.id !== id));
  };

  // 저장 (신규 작성 → POST/기존 이력서 있음 → PATCH)
  const handleSave = async () => {
    if (!canSave || isSaving) return;

    // 로그인 여부 우선 확인
    if (!isLoggedIn) {
      setShowLoginRequiredModal(true);
      return;
    }

    // 저장 전 필수 입력 검증 - 실패 시 각 섹션 아래 안내문구만 표시
    const educationErrorMessage = getEducationError(educations);
    const careerErrorMessage = getCareerError(careers, isNewGraduate);
    const certificationErrorMessage = getCertificationError(certifications);

    setEducationError(educationErrorMessage);
    setCareerError(careerErrorMessage);
    setCertificationError(certificationErrorMessage);

    if (educationErrorMessage || careerErrorMessage || certificationErrorMessage) {
      return;
    }

    setIsSaving(true);
    try {
      const payload: ResumePayload = {
        educations: educations.map((e) => ({
          schoolName: e.schoolName,
          startYearMonth: e.startYearMonth,
          endYearMonth: e.endYearMonth,
          degree: e.degree as DegreeType,
          major: e.major,
          graduationStatus: e.graduationStatus as GraduationStatus,
          minorOrResearch: e.minorOrResearch || undefined,
        })),
        entryLevel: isNewGraduate,
        careers: careers.map((c) => ({
          companyName: c.companyName,
          startYearMonth: c.startYearMonth,
          endYearMonth: c.currentlyEmployed ? null : c.endYearMonth,
          currentlyEmployed: c.currentlyEmployed,
          employmentType: c.employmentType as EmploymentType,
          customEmploymentType:
            c.employmentType === 'OTHER' ? c.customEmploymentType || null : null,
          jobTitle: c.jobTitle,
        })),
        certifications: certifications.map((cert) => ({
          name: cert.name,
          type: cert.type as CertificationType,
          issuer: cert.issuer,
          acquiredDate: cert.acquiredDate,
          scoreOrGrade: cert.scoreOrGrade || undefined,
        })),
        defaultResume: true,
      };

      // 이미 저장된 이력서가 있으면 수정(PATCH), 없으면 신규 작성(POST)
      if (resumeId !== null) {
        const result = await updateResumeAction(resumeId, payload);
        if (result.success) {
          setLastSavedSnapshot(currentSnapshot);
          showToast('이력서가 저장되었습니다.');
        } else if (result.maintenance) {
          setMaintenance(true, result.message);
          return;
        } else if (result.authError) {
          showToast(result.message ?? '다른 기기에서 로그인되어 자동 로그아웃 되었습니다.', 'alarm');
          await logoutAction();
          return;
        } else if (result.validationError) {
          showToast('입력한 이력서 내용을 확인해주세요.', 'negative');
        } else {
          showToast('이력서 저장에 실패했습니다.', 'negative');
        }
      } else {
        const result = await saveResumeAction(payload);

        if (result.success) {
          setResumeId(result.resumeId ?? null);
          setLastSavedSnapshot(currentSnapshot);
          showToast('이력서가 저장되었습니다.');
        } else if (result.maintenance) {
          setMaintenance(true, result.message);
          return;
        } else if (result.authError) {
          showToast(result.message ?? '다른 기기에서 로그인되어 자동 로그아웃 되었습니다.', 'alarm');
          await logoutAction();
          return;
        } else if (result.validationError) {
          showToast('입력한 이력서 내용을 확인해주세요.', 'negative');
        } else {
          showToast('이력서 저장에 실패했습니다.', 'negative');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    router,
    // 학력
    educations,
    educationError,
    addEducation,
    removeEducation,
    updateEducation,
    handleEducationDateChange,
    // 경력
    careers,
    isNewGraduate,
    careerError,
    addCareer,
    removeCareer,
    updateCareer,
    handleCareerDateChange,
    handleNewGraduateToggle,
    // 자격증
    certifications,
    certificationError,
    addCertification,
    removeCertification,
    updateCertification,
    handleCertificationDateChange,
    // 저장
    handleSave,
    isSaving,
    canSave,
    // 로그인 필요 모달
    showLoginRequiredModal,
    setShowLoginRequiredModal,
  };
}
