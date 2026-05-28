'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface CertificationItem {
  name: string;
  file: File;
}

interface Step02Data {
  job: string;
  yearsOfExperience: string;
  hasOnlineExperience: boolean | null;
  platformName: string;
  studentCount: string;
  reviewLink: string;
  certifications: CertificationItem[];
  channelLink: string;
}

interface Step02CareerProps {
  data: Step02Data;
  onNext: (data: Step02Data) => void;
  onPrev: () => void;
}

export default function Step02Career({ data, onNext, onPrev }: Step02CareerProps) {
  const [form, setForm] = useState<Step02Data>(data);
  const [submitted, setSubmitted] = useState(false);
  const certFileRef = useRef<HTMLInputElement>(null);

  const isValid = form.certifications.length > 0;
  const isError = submitted && !isValid;

  const handleNext = () => {
    setSubmitted(true);
    if (!isValid) return;
    onNext(form);
  };

  const addCertificationFiles = (files: File[]) => {
    setForm((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        ...files.map((file) => ({ name: file.name.replace(/\.[^/.]+$/, ''), file })),
      ],
    }));
    if (certFileRef.current) certFileRef.current.value = '';
  };

  const removeCertification = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx),
    }));
  };

  const inputCls =
    'w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';
  const labelCls = 'block text-[13.5px] font-semibold text-[#1E2125] mb-1.5';

  return (
    <div className="flex flex-col gap-6">
      {/* 안내 메시지 */}
      <div className={`flex items-center gap-2 rounded-lg px-4 py-3 border transition-colors ${
        isError ? 'bg-[#FFEBEB] border-[#FF5E5E]' : 'bg-[#F9FBE7] border-[#827717]'
      }`}>
        <span className={`font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>ⓘ</span>
        <p className={`text-[13px] font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>
          강사님의 실무 역량과 경험을 알려주세요.
        </p>
      </div>

      {/* 현재 직업/소속 (선택) */}
      <div>
        <label className={labelCls}>현재 직업 / 소속 (선택)</label>
        <input
          type="text"
          placeholder="예: ○○회사 데이터분석팀 / 프리랜서 강사"
          value={form.job}
          onChange={(e) => setForm((prev) => ({ ...prev, job: e.target.value }))}
          className={inputCls}
        />
      </div>

      {/* 실무 경력 연수 (선택) */}
      <div>
        <label className={labelCls}>관련 분야 실무 경력 연수 (선택)</label>
        <input
          type="number"
          min={0}
          placeholder="예: 5"
          value={form.yearsOfExperience}
          onChange={(e) => setForm((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
          className={inputCls}
        />
      </div>

      {/* 온라인 강의 경험 (선택) */}
      <div>
        <label className={labelCls}>온라인 강의 경험 여부 (선택)</label>
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  hasOnlineExperience: prev.hasOnlineExperience === val ? null : val,
                }))
              }
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

      {/* 보유 자격증 (필수) */}
      <div>
        <label className={labelCls}>
          보유 자격증 <span className="text-[#FF5E5E]">*</span>
        </label>

        {/* 파일 첨부 버튼 */}
        <input
          type="file"
          ref={certFileRef}
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) addCertificationFiles(files);
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => certFileRef.current?.click()}
          className={`w-full h-11 rounded-lg border border-dashed text-[13px] transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            isError
              ? 'border-[#FF5E5E] bg-[#FFEBEB] text-[#FF5E5E]'
              : 'border-[#D1D5DB] bg-[#F9FAFB] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125]'
          }`}
        >
          <span>↑</span> 자격증 파일 첨부 (PDF, JPG, PNG · 여러 개 가능)
        </button>

        {isError && (
          <p className="text-[12px] text-[#FF5E5E] mt-1">자격증을 1개 이상 첨부해주세요.</p>
        )}

        {/* 첨부된 자격증 목록 */}
        {form.certifications.length > 0 && (
          <div className="flex flex-col gap-2 mt-2.5">
            {form.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#CFEE5D] bg-[#F1FFC1]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#A8D014]">✓</span>
                  <span className="text-[13px] font-medium text-[#1E2125]">📎 {cert.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(idx)}
                  className="text-[#6A7282] hover:text-[#FF5E5E] cursor-pointer text-[16px]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 참고 채널 링크 (선택) */}
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