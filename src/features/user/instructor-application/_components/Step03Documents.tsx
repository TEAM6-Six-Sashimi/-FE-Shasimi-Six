'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

interface Step03Data {
  resumeFile: File | null;
  // portfolioFile: File | null;
  curriculumFile: File | null;
  portfolioUrl: string;
  sampleVideoLink: string;
}

interface Step03DocumentsProps {
  data: Step03Data;
  onSubmit: (data: Step03Data) => void;
  onPrev: () => void;
}

const formatFileSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;

export default function Step03Documents({ data, onSubmit, onPrev }: Step03DocumentsProps) {
  const [form, setForm] = useState<Step03Data>(data);
  const [submitted, setSubmitted] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const resumeRef = useRef<HTMLInputElement>(null);
  // const portfolioRef = useRef<HTMLInputElement>(null);
  const curriculumRef = useRef<HTMLInputElement>(null);

  // 포트폴리오만 필수
  const isValid = !!form.portfolioUrl.trim();
  const isError = submitted && !isValid;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isValid) return;
    setConfirmModal(true);
  };

  const handleConfirm = () => {
    setConfirmModal(false);
    onSubmit(form);
  };

  const labelCls = 'block text-[13.5px] font-semibold text-[#1E2125] mb-1.5';

  const FileUploadField = ({
    label,
    required,
    accept,
    acceptLabel,
    file,
    inputRef,
    onFile,
  }: {
    label: string;
    required?: boolean;
    accept: string;
    acceptLabel: string;
    file: File | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onFile: (file: File | null) => void;
  }) => (
    <div>
      <label className={labelCls}>
        {label}{' '}
        {required ? (
          <span className="text-[#FF5E5E]">*</span>
        ) : (
          <span className="text-[#6A7282] text-[12px]">(선택)</span>
        )}
      </label>
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#CFEE5D] bg-[#F1FFC1]">
          <div className="flex items-center gap-2">
            <span className="text-[#A8D014]">✓</span>
            <div>
              <p className="text-[13px] font-medium text-[#1E2125]">{file.name}</p>
              <p className="text-[11.5px] text-[#6A7282]">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="text-[#6A7282] hover:text-[#FF5E5E] cursor-pointer text-[16px]"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg border border-dashed ${
            isError && required ? 'border-[#FF5E5E] bg-[#FFEBEB]' : 'border-[#D1D5DB] bg-[#F9FAFB]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#6A7282]">↑</span>
            <div>
              <p className="text-[13px] text-[#6A7282]">파일을 드래그하거나 선택하세요</p>
              <p className="text-[11.5px] text-[#6A7282]">{acceptLabel}</p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="h-9 px-4 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] cursor-pointer shrink-0"
          >
            파일 선택
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 안내 메시지 */}
      <div
        className={`flex items-center gap-2 rounded-lg px-4 py-3 border transition-colors ${
          isError ? 'bg-[#FFEBEB] border-[#FF5E5E]' : 'bg-[#F9FBE7] border-[#827717]'
        }`}
      >
        <span className={`font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>ⓘ</span>
        <p className={`text-[13px] font-semibold ${isError ? 'text-[#FF5E5E]' : 'text-[#827717]'}`}>
          포트폴리오는 필수 제출 항목입니다. <br /> 제출 후 사내 평가를 거쳐 일주일 이내에 결과를
          이메일로 안내드립니다.
        </p>
      </div>

      {/* 이력서 (선택) */}
      <FileUploadField
        label="이력서"
        accept=".pdf,.doc,.docx"
        acceptLabel="PDF, DOC, DOCX"
        file={form.resumeFile}
        inputRef={resumeRef}
        onFile={(f) => setForm((prev) => ({ ...prev, resumeFile: f }))}
      />

      {/* 포트폴리오 (필수) */}
      <div>
        <label className={labelCls}>
          포트폴리오 <span className="text-[#FF5E5E]">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6A7282]">🔗</span>
          <input
            type="url"
            required
            placeholder="링크를 입력해주세요"
            value={form.portfolioUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
            className="w-full h-11 pl-9 pr-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
        </div>
      </div>

      {/* 강의계획서 / 샘플 커리큘럼 (선택) */}
      <FileUploadField
        label="강의계획서 / 샘플 커리큘럼"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        acceptLabel="PDF, DOC, DOCX, PPT, PPTX"
        file={form.curriculumFile}
        inputRef={curriculumRef}
        onFile={(f) => setForm((prev) => ({ ...prev, curriculumFile: f }))}
      />

      {/* 샘플 강의 영상 링크 (선택) */}
      <div>
        <label className={labelCls}>
          샘플 강의 영상 링크 <span className="text-[#6A7282] text-[12px]">(선택)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6A7282]">🔗</span>
          <input
            type="url"
            placeholder="유튜브 또는 구글 드라이브 링크를 입력해주세요"
            value={form.sampleVideoLink}
            onChange={(e) => setForm((prev) => ({ ...prev, sampleVideoLink: e.target.value }))}
            className="w-full h-11 pl-9 pr-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
        </div>
      </div>

      {/* 이전 / 지원하기 버튼 */}
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
          onClick={handleSubmit}
          className="h-12 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
        >
          지원하기
        </Button>
      </div>

      {/* 확인 모달 */}
      {confirmModal && (
        <TwoButtonModal
          title="강사 지원"
          message="강사 지원을 제출하시겠습니까?"
          confirmLabel="지원하기"
          cancelLabel="취소"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmModal(false)}
        />
      )}
    </div>
  );
}
