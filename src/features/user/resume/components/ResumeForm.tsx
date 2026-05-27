'use client';

import { useState } from 'react';
import type {
  AwardItem,
  CareerItem,
  CareerStatus,
  EducationItem,
  ResumeFormData,
} from '@/features/user/resume/types';

interface ResumeFormProps {
  onSubmit?: (data: ResumeFormData) => void;
  onCancel?: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

const EMPTY_FORM: ResumeFormData = {
  title: '',
  defaultResume: false,
  name: '',
  phone: '',
  email: '',
  introduction: '',
  careerStatus: 'NEWBIE',
  educations: [],
  careers: [],
  skills: [],
  awards: [],
};

const labelCls = 'block text-[13px] font-semibold text-[#1E2125] mb-1.5';
const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#FF5F5F] transition-colors';
const sectionCls = 'border-t border-[#E5E7EB] pt-6 mt-6';
const addBtnCls =
  'w-full py-2.5 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#FF5F5F] hover:text-[#FF5F5F] cursor-pointer transition-colors';

export default function ResumeForm({ onSubmit, onCancel }: ResumeFormProps) {
  const [form, setForm] = useState<ResumeFormData>(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState('');

  // ─── 기본 정보 ───
  const updateField = <K extends keyof ResumeFormData>(key: K, value: ResumeFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ─── 학력 ───
  const addEducation = () =>
    setForm((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        { id: uid(), schoolName: '', major: '', startYear: '', endYear: '' },
      ],
    }));

  const updateEducation = (id: string, patch: Partial<EducationItem>) =>
    setForm((prev) => ({
      ...prev,
      educations: prev.educations.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));

  const removeEducation = (id: string) =>
    setForm((prev) => ({
      ...prev,
      educations: prev.educations.filter((e) => e.id !== id),
    }));

  // ─── 경력 ───
  const addCareer = () =>
    setForm((prev) => ({
      ...prev,
      careers: [
        ...prev.careers,
        {
          id: uid(),
          companyName: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }));

  const updateCareer = (id: string, patch: Partial<CareerItem>) =>
    setForm((prev) => ({
      ...prev,
      careers: prev.careers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));

  const removeCareer = (id: string) =>
    setForm((prev) => ({
      ...prev,
      careers: prev.careers.filter((c) => c.id !== id),
    }));

  // ─── 스킬 ───
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || form.skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
  };

  const removeSkill = (s: string) =>
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((x) => x !== s) }));

  // ─── 자격증 ───
  const addAward = () =>
    setForm((prev) => ({
      ...prev,
      awards: [
        ...prev.awards,
        { id: uid(), name: '', acquiredAt: '', type: '', fileName: '' },
      ],
    }));

  const updateAward = (id: string, patch: Partial<AwardItem>) =>
    setForm((prev) => ({
      ...prev,
      awards: prev.awards.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));

  const removeAward = (id: string) =>
    setForm((prev) => ({
      ...prev,
      awards: prev.awards.filter((a) => a.id !== id),
    }));

  // ─── 제출 ───
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(form);
    } else {
      // 백엔드 응답 구조 확정 전 임시 처리
      alert('이력서 저장 기능은 백엔드 응답 구조 변경 후 활성화됩니다.\n현재는 UI 프레임만 동작합니다.');
      console.log('[ResumeForm draft]', form);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-7"
    >
      <h2 className="text-[18px] font-bold text-[#1E2125] mb-1">이력서 작성</h2>

      {/* ─── 제목 + 기본 이력서 ─── */}
      <div className="mt-5">
        <label className={labelCls}>
          제목 <span className="text-[#FF5F5F]">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="예) 2026 백엔드 개발자 이력서"
          className={inputCls}
          maxLength={100}
        />
        <label className="flex items-center gap-2 mt-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={form.defaultResume}
            onChange={(e) => updateField('defaultResume', e.target.checked)}
            className="w-4 h-4 accent-[#FF5F5F] cursor-pointer"
          />
          <span className="text-[12.5px] text-[#1E2125]">기본 이력서로 설정</span>
        </label>
      </div>

      {/* ─── 기본 정보 ─── */}
      <section className={sectionCls}>
        <div className="flex items-center gap-2 mb-4">
          <span>👤</span>
          <h3 className="text-[15px] font-bold text-[#1E2125]">기본 정보</h3>
        </div>

        <div className="flex gap-5 items-start">
          <div className="w-20 h-20 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] shrink-0">
            <span className="text-[22px]">👤</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                이름 <span className="text-[#FF5F5F]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="홍길동"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>연락처</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="010-1234-5678"
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>
                이메일 <span className="text-[#FF5F5F]">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="user@example.com"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className={labelCls}>
            간단 소개 <span className="text-[#FF5F5F]">*</span>
          </label>
          <textarea
            value={form.introduction}
            onChange={(e) => updateField('introduction', e.target.value)}
            placeholder="간단한 자기소개를 작성해주세요."
            rows={4}
            className={`${inputCls} resize-y`}
          />
        </div>
      </section>

      {/* ─── 경력 사항 ─── */}
      <section className={sectionCls}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span>💼</span>
            <h3 className="text-[15px] font-bold text-[#1E2125]">
              경력 사항 <span className="text-[#FF5F5F]">*</span>
            </h3>
          </div>
          <CareerStatusToggle
            value={form.careerStatus}
            onChange={(v) => updateField('careerStatus', v)}
          />
        </div>

        {form.careers.map((c) => (
          <div
            key={c.id}
            className="border border-[#E5E7EB] rounded-xl p-4 mb-3 bg-[#FAFAFA]"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={c.companyName}
                onChange={(e) => updateCareer(c.id, { companyName: e.target.value })}
                placeholder="회사명"
                className={inputCls}
              />
              <input
                type="text"
                value={c.position}
                onChange={(e) => updateCareer(c.id, { position: e.target.value })}
                placeholder="직책"
                className={inputCls}
              />
              <input
                type="text"
                value={c.startDate}
                onChange={(e) => updateCareer(c.id, { startDate: e.target.value })}
                placeholder="시작일 (YYYY.MM)"
                className={inputCls}
              />
              <input
                type="text"
                value={c.endDate}
                onChange={(e) => updateCareer(c.id, { endDate: e.target.value })}
                placeholder="종료일 (YYYY.MM 또는 재직중)"
                className={inputCls}
              />
            </div>
            <textarea
              value={c.description}
              onChange={(e) => updateCareer(c.id, { description: e.target.value })}
              placeholder="담당 업무 / 성과"
              rows={2}
              className={`${inputCls} mt-3 resize-y`}
            />
            <button
              type="button"
              onClick={() => removeCareer(c.id)}
              className="mt-2 text-[12px] text-[#9CA3AF] hover:text-[#FF5F5F] cursor-pointer"
            >
              항목 삭제
            </button>
          </div>
        ))}

        <button type="button" onClick={addCareer} className={addBtnCls}>
          + 경력 추가
        </button>
      </section>

      {/* ─── 학력 사항 ─── */}
      <section className={sectionCls}>
        <div className="flex items-center gap-2 mb-4">
          <span>🎓</span>
          <h3 className="text-[15px] font-bold text-[#1E2125]">
            학력 사항 <span className="text-[#FF5F5F]">*</span>
          </h3>
        </div>

        {form.educations.map((edu) => (
          <div
            key={edu.id}
            className="border border-[#E5E7EB] rounded-xl p-4 mb-3 bg-[#FAFAFA]"
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={edu.schoolName}
                onChange={(e) => updateEducation(edu.id, { schoolName: e.target.value })}
                placeholder="학교명"
                className={inputCls}
              />
              <input
                type="text"
                value={edu.major}
                onChange={(e) => updateEducation(edu.id, { major: e.target.value })}
                placeholder="전공"
                className={inputCls}
              />
              <input
                type="text"
                value={edu.startYear}
                onChange={(e) => updateEducation(edu.id, { startYear: e.target.value })}
                placeholder="입학연도 (YYYY)"
                className={inputCls}
              />
              <input
                type="text"
                value={edu.endYear}
                onChange={(e) => updateEducation(edu.id, { endYear: e.target.value })}
                placeholder="졸업연도 (YYYY)"
                className={inputCls}
              />
            </div>
            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="mt-2 text-[12px] text-[#9CA3AF] hover:text-[#FF5F5F] cursor-pointer"
            >
              항목 삭제
            </button>
          </div>
        ))}

        <button type="button" onClick={addEducation} className={addBtnCls}>
          + 학력 추가
        </button>
      </section>

      {/* ─── 스킬 ─── */}
      <section className={sectionCls}>
        <div className="flex items-center gap-2 mb-4">
          <span>{'</>'}</span>
          <h3 className="text-[15px] font-bold text-[#1E2125]">
            스킬 <span className="text-[#FF5F5F]">*</span>
          </h3>
        </div>

        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="내가 가진 직무 스킬을 입력해 주세요 (Enter로 추가)"
          className={inputCls}
        />

        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {form.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F0FDF4] border border-[#86EFAC] text-[12.5px] text-[#15803D]"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="text-[#15803D] hover:text-[#DC2626] cursor-pointer"
                  aria-label={`${s} 삭제`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ─── 수상 / 자격증 ─── */}
      <section className={sectionCls}>
        <div className="flex items-center gap-2 mb-4">
          <span>🏆</span>
          <h3 className="text-[15px] font-bold text-[#1E2125]">수상 / 자격증</h3>
        </div>

        {form.awards.map((a) => (
          <div
            key={a.id}
            className="border border-[#E5E7EB] rounded-xl p-4 mb-3 bg-[#FAFAFA]"
          >
            <div className="mb-3">
              <label className={labelCls}>활동명</label>
              <input
                type="text"
                value={a.name}
                onChange={(e) => updateAward(a.id, { name: e.target.value })}
                placeholder="수상명 또는 자격증명"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>취득일</label>
                <input
                  type="text"
                  value={a.acquiredAt}
                  onChange={(e) => updateAward(a.id, { acquiredAt: e.target.value })}
                  placeholder="YYYY.MM"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>타입</label>
                <select
                  value={a.type}
                  onChange={(e) => updateAward(a.id, { type: e.target.value })}
                  className={`${inputCls} cursor-pointer`}
                >
                  <option value="">자격증/수상</option>
                  <option value="CERTIFICATE">자격증</option>
                  <option value="AWARD">수상</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className={labelCls}>자격증 파일 첨부 (PDF, 이미지)</label>
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-lg border border-[#D1D5DB] bg-white">
                <span className="text-[#9CA3AF]">⬆</span>
                <span className="flex-1 text-[12.5px] text-[#6A7282]">
                  {a.fileName || '파일을 드래그하거나 선택하세요 (PDF, DOC, DOCX)'}
                </span>
                <label className="px-3 py-1.5 rounded-md bg-[#FF5F5F] text-white text-[12px] cursor-pointer hover:bg-[#D14848] transition-colors">
                  파일 선택
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) updateAward(a.id, { fileName: file.name });
                    }}
                  />
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeAward(a.id)}
              className="mt-2 text-[12px] text-[#9CA3AF] hover:text-[#FF5F5F] cursor-pointer"
            >
              항목 삭제
            </button>
          </div>
        ))}

        <button type="button" onClick={addAward} className={addBtnCls}>
          + 항목 추가
        </button>
      </section>

      {/* ─── 버튼 ─── */}
      <div className="flex gap-2 mt-7">
        <button
          type="submit"
          className="flex-1 h-12 rounded-lg bg-[#FF5F5F] hover:bg-[#D14848] text-white font-semibold text-[15px] cursor-pointer active:scale-[0.99] transition-all"
        >
          저장하기
        </button>
        <button
          type="button"
          onClick={() => {
            if (onCancel) onCancel();
            else setForm(EMPTY_FORM);
          }}
          className="px-6 h-12 rounded-lg border border-[#D1D5DB] text-[#1E2125] font-semibold text-[15px] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
        >
          취소
        </button>
      </div>

      <p className="text-[11.5px] text-[#9CA3AF] mt-3 text-center">
        ⚠ 백엔드 응답 구조 변경 작업 중 — 저장 동작은 임시 비활성 상태입니다.
      </p>
    </form>
  );
}

// ─── 신입/경력자 토글 ───
function CareerStatusToggle({
  value,
  onChange,
}: {
  value: CareerStatus;
  onChange: (v: CareerStatus) => void;
}) {
  const base =
    'px-3 py-1.5 rounded-md text-[12.5px] font-semibold cursor-pointer transition-colors';
  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={() => onChange('NEWBIE')}
        className={`${base} ${
          value === 'NEWBIE'
            ? 'bg-white border border-[#D1D5DB] text-[#1E2125]'
            : 'bg-white border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#1E2125]'
        }`}
      >
        신입
      </button>
      <button
        type="button"
        onClick={() => onChange('EXPERIENCED')}
        className={`${base} ${
          value === 'EXPERIENCED'
            ? 'bg-[#FF5F5F] text-white border border-[#FF5F5F]'
            : 'bg-white border border-[#E5E7EB] text-[#9CA3AF] hover:text-[#1E2125]'
        }`}
      >
        경력자
      </button>
    </div>
  );
}
