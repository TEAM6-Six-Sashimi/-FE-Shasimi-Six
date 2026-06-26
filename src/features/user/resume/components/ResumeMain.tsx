'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useToast } from '@/components/ui/ToastContext';
import {
  CareerItem,
  CERTIFICATION_TYPE_LABEL,
  CertificationItem,
  CertificationType,
  DEGREE_LABEL,
  DegreeType,
  EducationItem,
  EMPLOYMENT_TYPE_LABEL,
  EmploymentType,
  GRADUATION_STATUS_LABEL,
  GraduationStatus,
  ResumePayload,
} from '../types';
import { saveResumeAction } from '../actions';

// 임시 id 생성용
function generateTempId() {
  return Math.random().toString(36).slice(2, 10);
}

const inputCls =
  'w-full h-9 px-3 rounded-lg border border-[#D1D5DB] bg-white text-[13px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors';

const labelCls = 'text-[13px] font-semibold text-[#1E2125] mb-2 flex items-center gap-0.5';

const DEGREE_OPTIONS: DegreeType[] = ['HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTOR'];

const GRADUATION_STATUS_OPTIONS: GraduationStatus[] = [
  'GRADUATED',
  'EXPECTED_GRADUATION',
  'ENROLLED',
  'LEAVE_OF_ABSENCE',
  'DROPPED_OUT',
];

const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = [
  'FULL_TIME',
  'CONTRACT',
  'PART_TIME',
  'FREELANCER',
  'OTHER',
];

const CERTIFICATION_TYPE_OPTIONS: CertificationType[] = [
  'CERTIFICATE',
  'LANGUAGE',
  'DRIVER_LICENSE',
  'EDUCATION',
  'OTHER',
];

function CheckboxToggle({
  checked,
  onChange,
  label,
  size = 'md',
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  size?: 'sm' | 'md';
}) {
  const boxSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-[11.5px]' : 'text-[12.5px]';

  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-1.5 ${textSize} text-[#1E2125] cursor-pointer`}
    >
      <span
        className={`${boxSize} shrink-0 rounded-sm flex items-center justify-center border transition-colors
          ${checked ? 'bg-[#FF5E5E] border-[#FF5E5E]' : 'bg-white border-[#D1D5DB]'}`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4L4 7L10 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

interface ResumeMainProps {
    userName: string;
    userPhone: string;
    userEmail: string;
  onSavedStateChange?: (isSaved: boolean, resumeId: number | null) => void;
  onDirtyStateChange?: (isDirty: boolean) => void;
}

export default function ResumeMain({
  userName,
  userPhone,
  userEmail,
  onSavedStateChange,
  onDirtyStateChange,
}: ResumeMainProps) {
  const { showToast } = useToast();

  // 이력서 작성부 상태
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [isNewGraduate, setIsNewGraduate] = useState(false);
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);

  // 저장 상태 추적
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // 현재 입력값의 스냅샷 (저장 여부/수정 감지에 사용)
  const currentSnapshot = useMemo(
    () => JSON.stringify({ educations, isNewGraduate, careers, certifications }),
    [educations, isNewGraduate, careers, certifications],
  );

  const isDirty = currentSnapshot !== lastSavedSnapshot;
  const isSaved = resumeId !== null;
  // 저장하기 버튼 활성화 조건: 새로 작성됐거나(아직 저장 안 됨) 수정이 감지된 경우
  const canSave = !isSaved || isDirty;

  // 부모(페이지)에 상태 변화 알림 - 사이드바에서 평가 가능 여부 판단용
  useEffect(() => {
    onSavedStateChange?.(isSaved && !isDirty, resumeId);
  }, [isSaved, isDirty, resumeId, onSavedStateChange]);
 
  useEffect(() => {
    onDirtyStateChange?.(isDirty);
  }, [isDirty, onDirtyStateChange]);

  //   학력 사항
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
  };

  //   경력 사항
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
  };

  // 신입 체크 시 기존 경력 입력값 초기화 (+ 버튼도 숨김)
  const handleNewGraduateToggle = () => {
    setIsNewGraduate((prev) => {
      const next = !prev;
      if (next) setCareers([]);
      return next;
    });
  };

  //   자격증
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
  };

  const removeCertification = (id: string) => {
    setCertifications((prev) => prev.filter((item) => item.id !== id));
  };

  const removeCareer = (id: string) => {
    setCareers((prev) => prev.filter((item) => item.id !== id));
  };

  //   저장
  const handleSave = async () => {
    if (!canSave || isSaving) return;

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

      const result = await saveResumeAction(payload);

      if (result.success) {
        setResumeId(result.resumeId ?? resumeId);
        setLastSavedSnapshot(currentSnapshot);
        showToast('이력서가 저장되었습니다.');
      } else {
        showToast('이력서 저장에 실패했습니다.', 'negative');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
      <h2 className="text-[20px] font-extrabold mt-2 text-[#1E2125]">이력서 작성</h2>

      {/* 로그인 정보 (읽기 전용) */}
      <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]">
        <p className="text-[11.5px] text-[#9CA3AF] flex items-center gap-1 mb-3">
          <Image src="/auth/lock.svg" alt="자물쇠" width={13} height={13} /> 로그인 정보
        </p>
        <p className="text-[18px] font-bold text-[#1E2125] mb-1">{userName}</p>
        <div className="flex items-center gap-5 text-[13px] text-[#6A7282]">
          <span className="flex items-center gap-1">
            <Image src="/ai-resume/phone.svg" alt="전화번호" width={15} height={15} /> {userPhone}
          </span>
          <span className="flex items-center gap-1">
            <Image src="/ai-resume/email.svg" alt="이메일" width={15} height={15} /> {userEmail}
          </span>
        </div>
      </div>

      <hr className="border-[#E5E7EB]" />

      {/* ─────────────── 학력 사항 ─────────────── */}
      <div>
        <h3 className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#1E2125] mb-3">
          <Image src="/ai-resume/scholar.svg" alt="학력사항" width={17} height={17} /> 학력 사항{' '}
          <span className="text-[#FF5E5E]">*</span>
        </h3>

        <div className="flex flex-col gap-3">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="relative border border-[#E5E7EB] rounded-lg p-4 bg-[#F9FAFB] flex flex-col py-5 gap-3"
            >
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#1E2125] cursor-pointer"
                aria-label="삭제"
              >
                ✕
              </button>

              <div>
                <label className={labelCls}>
                  학교명 <span className="text-[#FF5E5E]">*</span>
                </label>
                <input
                  type="text"
                  value={edu.schoolName}
                  onChange={(e) => updateEducation(edu.id, 'schoolName', e.target.value)}
                  placeholder="학교명을 입력하세요"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>
                    입학일 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.startYearMonth}
                    onChange={(e) => updateEducation(edu.id, 'startYearMonth', e.target.value)}
                    placeholder="YYYY-MM"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    졸업일(예정일) <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.endYearMonth}
                    onChange={(e) => updateEducation(edu.id, 'endYearMonth', e.target.value)}
                    placeholder="YYYY-MM"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    졸업 상태 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <select
                    value={edu.graduationStatus}
                    onChange={(e) => updateEducation(edu.id, 'graduationStatus', e.target.value)}
                    className={inputCls}
                  >
                    <option value="" disabled>
                      선택
                    </option>
                    {GRADUATION_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {GRADUATION_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    전공 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.major}
                    onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                    placeholder="예: 컴퓨터공학과"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    학위 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <select
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className={inputCls}
                  >
                    <option value="" disabled>
                      선택
                    </option>
                    {DEGREE_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {DEGREE_LABEL[d]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>부전공 또는 연구 내용 (선택)</label>
                <input
                  type="text"
                  value={edu.minorOrResearch}
                  onChange={(e) => updateEducation(edu.id, 'minorOrResearch', e.target.value)}
                  placeholder="예: 데이터과학 부전공"
                  className={inputCls}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEducation}
            className="w-full py-2.5 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer"
          >
            + 학력 추가
          </button>
        </div>
      </div>

      <hr className="border-[#E5E7EB]" />

      {/* ─────────────── 경력 사항 ─────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#1E2125]">
            <Image src="/ai-resume/career.svg" alt="경력사항" width={16} height={16} /> 경력 사항{' '}
            <span className="text-[#FF5E5E]">*</span>
          </h3>
          <CheckboxToggle checked={isNewGraduate} onChange={handleNewGraduateToggle} label="신입" />
        </div>

        {!isNewGraduate && (
          <div className="flex flex-col gap-3">
            {careers.map((career) => (
              <div
                key={career.id}
                className="relative border border-[#E5E7EB] rounded-lg p-4 bg-[#F9FAFB] flex flex-col py-5 gap-3"
              >
                <button
                  type="button"
                  onClick={() => removeCareer(career.id)}
                  className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#1E2125] cursor-pointer"
                  aria-label="삭제"
                >
                  ✕
                </button>

                <div>
                  <label className={labelCls}>
                    회사명 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={career.companyName}
                    onChange={(e) => updateCareer(career.id, 'companyName', e.target.value)}
                    placeholder="회사명을 입력하세요"
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      입사일 <span className="text-[#FF5E5E]">*</span>
                    </label>
                    <input
                      type="text"
                      value={career.startYearMonth}
                      onChange={(e) => updateCareer(career.id, 'startYearMonth', e.target.value)}
                      placeholder="YYYY-MM"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className={labelCls}>
                        퇴사일 <span className="text-[#FF5E5E]">*</span>
                      </label>
                      <CheckboxToggle
                        checked={career.currentlyEmployed}
                        onChange={() =>
                          updateCareer(career.id, 'currentlyEmployed', !career.currentlyEmployed)
                        }
                        label="재직 중"
                        size="md"
                      />
                    </div>
                    <input
                      type="text"
                      value={career.endYearMonth}
                      onChange={(e) => updateCareer(career.id, 'endYearMonth', e.target.value)}
                      placeholder="YYYY-MM"
                      disabled={career.currentlyEmployed}
                      className={`${inputCls} ${career.currentlyEmployed ? 'bg-[#F3F4F6] text-[#9CA3AF]' : ''}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      재직 형태 <span className="text-[#FF5E5E]">*</span>
                    </label>
                    <select
                      value={career.employmentType}
                      onChange={(e) => updateCareer(career.id, 'employmentType', e.target.value)}
                      className={inputCls}
                    >
                      <option value="" disabled>
                        선택
                      </option>
                      {EMPLOYMENT_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {EMPLOYMENT_TYPE_LABEL[t]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>
                      직무 / 직책 <span className="text-[#FF5E5E]">*</span>
                    </label>
                    <input
                      type="text"
                      value={career.jobTitle}
                      onChange={(e) => updateCareer(career.id, 'jobTitle', e.target.value)}
                      placeholder="예: 백엔드 개발자 / 주임"
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* 재직 형태 '기타'일 때 직접 입력 노출 */}
                {career.employmentType === 'OTHER' && (
                  <div>
                    <label className={labelCls}>재직 형태 직접 입력</label>
                    <input
                      type="text"
                      value={career.customEmploymentType}
                      onChange={(e) =>
                        updateCareer(career.id, 'customEmploymentType', e.target.value)
                      }
                      placeholder="예: 인턴"
                      className={inputCls}
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addCareer}
              className="w-full py-2.5 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer"
            >
              + 경력 추가
            </button>
          </div>
        )}
      </div>

      <hr className="border-[#E5E7EB]" />

      {/* ─────────────── 보유 기술 및 자격증 ─────────────── */}
      <div>
        <h3 className="flex items-center gap-1.5 text-[14.5px] font-bold text-[#1E2125] mb-3">
          <Image src="/ai-resume/skill.svg" alt="보유 기술 및 자격증" width={17} height={17} /> 보유
          기술 및 자격증 <span className="text-[#FF5E5E]">*</span>
        </h3>

        <div className="flex flex-col gap-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="relative border border-[#E5E7EB] rounded-lg p-4 bg-[#F9FAFB] flex flex-col py-5 gap-3"
            >
              <button
                type="button"
                onClick={() => removeCertification(cert.id)}
                className="absolute top-3 right-3 text-[#9CA3AF] hover:text-[#1E2125] cursor-pointer"
                aria-label="삭제"
              >
                ✕
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>
                    자격증 유형 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <select
                    value={cert.type}
                    onChange={(e) => updateCertification(cert.id, 'type', e.target.value)}
                    className={inputCls}
                  >
                    <option value="" disabled>
                      선택
                    </option>
                    {CERTIFICATION_TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {CERTIFICATION_TYPE_LABEL[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>
                    자격증명 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="예: 정보처리기사"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>
                    발급기관 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="예: 한국산업인력공단"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    취득일자 <span className="text-[#FF5E5E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={cert.acquiredDate}
                    onChange={(e) => updateCertification(cert.id, 'acquiredDate', e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>점수/등급 (선택)</label>
                  <input
                    type="text"
                    value={cert.scoreOrGrade}
                    onChange={(e) => updateCertification(cert.id, 'scoreOrGrade', e.target.value)}
                    placeholder="예: 1급"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCertification}
            className="w-full py-2.5 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer"
          >
            + 자격 추가
          </button>
        </div>
      </div>

      {/* 저장 버튼 */}
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
    </div>
  );
}
