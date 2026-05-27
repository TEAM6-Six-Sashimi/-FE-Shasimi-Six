'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Step02Data {
  job: string;
  yearsOfExperience: string;
  hasOnlineExperience: boolean | null;
  platformName: string;
  studentCount: string;
  reviewLink: string;
  certifications: string[];
  channelLink: string;
}

interface Step02CareerProps {
  data: Step02Data;
  onNext: (data: Step02Data) => void;
  onPrev: () => void;
}

export default function Step02Career({ data, onNext, onPrev }: Step02CareerProps) {
  const [form, setForm] = useState<Step02Data>(data);
  const [certInput, setCertInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    !!form.job.trim() && !!form.yearsOfExperience.trim() && form.hasOnlineExperience !== null;

  const handleNext = () => {
    setSubmitted(true);
    if (!isValid) return;
    onNext(form);
  };

  const inputCls =
    'w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';
  const labelCls = 'block text-[13.5px] font-semibold text-[#1E2125] mb-1.5';
  const isError = submitted && !isValid;

  const addCertification = () => {
    if (!certInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      certifications: [...prev.certifications, certInput.trim()],
    }));
    setCertInput('');
  };

  const removeCertification = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 안내 메시지 */}
      <div className={`flex items-center gap-2 rounded-lg px-4 py-3 border transition-colors ${
        isError
          ? 'bg-[#FFEBEB] border-[#FF5E5E]'
          : 'bg-[#F9FBE7] border-[#827717]'
      }`}>
        <span className={`font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>ⓘ</span>
        <p className={`text-[13px] font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>
          강사님의 실무 역량과 경험을 알려주세요.
        </p>
      </div>

      {/* 현재 직업/소속 */}
      <div>
        <label className={labelCls}>
          현재 직업 / 소속 <span className="text-[#FF5E5E]">*</span>
        </label>
        <input
          type="text"
          placeholder="예: ○○회사 데이터분석팀 / 프리랜서 강사"
          value={form.job}
          onChange={(e) => setForm((prev) => ({ ...prev, job: e.target.value }))}
          className={inputCls}
        />
      </div>

      {/* 실무 경력 연수 */}
      <div>
        <label className={labelCls}>
          관련 분야 실무 경력 연수 <span className="text-[#FF5E5E]">*</span>
        </label>
        <input
          type="number"
          min={0}
          placeholder="예: 5"
          value={form.yearsOfExperience}
          onChange={(e) => setForm((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
          className={inputCls}
        />
      </div>

      {/* 온라인 강의 경험 */}
      <div>
        <label className={labelCls}>온라인 강의 경험 여부</label>
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, hasOnlineExperience: val }))}
              className={`h-11 rounded-lg text-[13.5px] font-semibold border transition-colors cursor-pointer ${
                form.hasOnlineExperience === val
                  ? 'bg-[#FF5E5E] border-[#FF5E5E] text-white'
                  : 'bg-white border-[#D1D5DB] text-[#1E2125] hover:border-[#1E2125]'
              }`}
            >
              {val ? '있음' : '없음'}
            </button>
          ))}
        </div>

        {/* 있음 선택 시 추가 필드 */}
        {form.hasOnlineExperience === true && (
          <div className="mt-4 flex flex-col gap-3 p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">플랫폼명</label>
              <input
                type="text"
                placeholder="예: 인프런, 유데미 등"
                value={form.platformName}
                onChange={(e) => setForm((prev) => ({ ...prev, platformName: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">강의 링크</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.reviewLink}
                onChange={(e) => setForm((prev) => ({ ...prev, reviewLink: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>
        )}
      </div>

      {/* 보유 자격증 */}
      <div>
        <label className={labelCls}>보유 자격증</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="자격증명을 입력하고 추가 버튼을 클릭하세요"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCertification()}
            className={`${inputCls} flex-1`}
          />
          <Button
            type="button"
            onClick={addCertification}
            className="h-11 px-5 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold cursor-pointer shrink-0"
          >
            추가
          </Button>
        </div>
        {form.certifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {form.certifications.map((cert, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9FBE7] text-[12.5px] text-[#827717] font-semibold"
              >
                {cert}
                <button
                  type="button"
                  onClick={() => removeCertification(idx)}
                  className="text-[#6A7282] hover:text-[#FF5E5E] cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 참고 채널 링크 */}
      <div>
        <label className={labelCls}>참고 채널 링크 (선택)</label>
        <input
          type="url"
          placeholder="유튜브, 블로그, SNS 등의 URL"
          value={form.channelLink}
          onChange={(e) => setForm((prev) => ({ ...prev, channelLink: e.target.value }))}
          className={inputCls}
        />
      </div>

      {/* 이전 / 다음 버튼 */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="h-12 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
        >
          &lt; 이전
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="h-12 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
        >
          다음 &gt;
        </Button>
      </div>
    </div>
  );
}