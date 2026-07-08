'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';

export interface CertificationItem {
  name: string;
  file: File;
}

export interface Step02Data {
  certifications: CertificationItem[];
  resumeFile: File | null;
  portfolioUrl: string;
  agreePrivacy: boolean;
  agreePublicProfile: boolean;
}

interface Step02DocumentsProps {
  data: Step02Data;
  onSubmit: (data: Step02Data) => void;
  onPrev: () => void;
}

const formatFileSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;

const ALLOWED_CERT_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_RESUME_TYPES = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

function CheckboxItem({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer w-fit">
      <span className="relative w-4 h-4 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 w-4 h-4 opacity-0 cursor-pointer"
        />
        <span
          className={`absolute inset-0 rounded border flex items-center justify-center transition-colors ${
            checked ? 'bg-[#CFEE5D] border-[#CFEE5D]' : 'bg-white border-[#D1D5DB]'
          }`}
        >
          {checked && (
            <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 fill-none stroke-[#1E2125] stroke-2">
              <path d="M2 6L5 9L10 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </span>
      <span className="text-[13px] text-[#1E2125]">{children}</span>
    </label>
  );
}

export default function Step02Documents({ data, onSubmit, onPrev }: Step02DocumentsProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<Step02Data>(data);
  const [submitted, setSubmitted] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [certError, setCertError] = useState('');
  const [resumeError, setResumeError] = useState('');
  const [templateDownloading, setTemplateDownloading] = useState(false);
  const [isCertDragging, setIsCertDragging] = useState(false);
  const [isResumeDragging, setIsResumeDragging] = useState(false);
  const certFileRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const isCertValid = form.certifications.length > 0;
  const isResumeValid = !!form.resumeFile;
  const isPortfolioValid = !!form.portfolioUrl.trim();
  const isAgreeValid = form.agreePrivacy && form.agreePublicProfile;

  const isValid = isCertValid && isResumeValid && isPortfolioValid && isAgreeValid;
  const isError = submitted && !isValid;

  const addCertificationFiles = (files: File[]) => {
    const invalid = files.find((f) => !ALLOWED_CERT_TYPES.includes(f.type));
    if (invalid) {
      setCertError('PDF, JPG, PNG 파일만 첨부할 수 있습니다.');
      if (certFileRef.current) certFileRef.current.value = '';
      return;
    }
    setCertError('');
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

  const handleCertDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsCertDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) addCertificationFiles(files);
  };

  const handleResumeChange = (file: File | null) => {
    if (file && !ALLOWED_RESUME_TYPES.includes(file.type)) {
      setResumeError('docx 파일만 첨부할 수 있습니다.');
      if (resumeRef.current) resumeRef.current.value = '';
      return;
    }
    setResumeError('');
    setForm((prev) => ({ ...prev, resumeFile: file }));
  };

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResumeDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleResumeChange(file);
  };

  const handleTemplateDownload = async () => {
    try {
      setTemplateDownloading(true);
      const res = await fetch('/api/resume-template');
      if (!res.ok) throw new Error('다운로드 실패');

      const blob = await res.blob();
      const disposition = res.headers.get('content-disposition') ?? '';
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch?.[1] ?? 'resume-template.docx';

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      showToast('이력서 양식을 다운로드하지 못했습니다. 잠시 후 다시 시도해주세요.', 'negative');
    } finally {
      setTemplateDownloading(false);
    }
  };

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
  const fieldErrorCls = 'text-[12px] text-[#DC2626] mt-1';

  return (
    <div className="flex flex-col gap-6">
      {/* 안내 메시지 */}
      <div
        role={isError ? 'alert' : undefined}
        className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-colors ${
          isError ? 'bg-[#FFEBEB]' : 'bg-[#FEFCE8]'
        }`}
      >
        <span className={`font-semibold ${isError ? 'text-[#DC2626]' : 'text-[#854D0E]'}`}>ⓘ</span>
        <p className={`text-[13px] ${isError ? 'text-[#DC2626]' : 'text-[#854D0E]'}`}>
          강사님의 기본 정보를 입력해주세요. 모든 필수 항목을 완료 후 다음 단계로 이동합니다.
        </p>
      </div>

      {/* 보유 자격증 (필수) */}
      <div>
        <label className={labelCls}>
          보유 자격증 <span className="text-[#FF5E5E]">*</span>
        </label>
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
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsCertDragging(true);
          }}
          onDragLeave={() => setIsCertDragging(false)}
          onDrop={handleCertDrop}
          className={`flex items-center justify-between px-4 py-3 rounded-lg border border-dashed transition-colors ${
            isCertDragging
              ? 'border-[#FF5E5E] bg-[#FFEBEB]'
              : (isError && !isCertValid) || certError
                ? 'border-[#FF5E5E] bg-[#F9FAFB]'
                : 'border-[#D1D5DB] bg-[#F9FAFB]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[#6A7282]">↑</span>
            <div>
              <p className="text-[13px] text-[#6A7282]">파일을 드래그하거나 선택하세요</p>
              <p className="text-[11.5px] text-[#6A7282]">PDF, PNG, JPG</p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => certFileRef.current?.click()}
            className="h-9 px-4 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] cursor-pointer shrink-0"
          >
            파일 선택
          </Button>
        </div>

        {certError && <p className={fieldErrorCls}>⚠ {certError}</p>}
        {isError && !isCertValid && !certError && (
          <p className={fieldErrorCls}>⚠ 자격증을 1개 이상 첨부해주세요.</p>
        )}

        {form.certifications.length > 0 && (
          <div className="flex flex-col gap-2 mt-2.5">
            {form.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#CFEE5D] bg-[#F1FFC1]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#A8D014]">✓</span>
                  <span className="text-[13px] font-medium text-[#1E2125]">
                    {cert.name} ({formatFileSize(cert.file.size)})
                  </span>
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

      {/* 이력서 (필수) */}
      <div>
        <label className="block text-[13.5px] font-semibold text-[#1E2125] mb-1.5">
          이력서 <span className="text-[#FF5E5E]">*</span>
        </label>
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={handleTemplateDownload}
            disabled={templateDownloading}
            className="inline-flex items-center h-8 px-3 text-[12px] rounded-md border border-[#FF5E5E] text-[#FF5E5E] hover:bg-[#FFEBEB] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {templateDownloading ? '다운로드 중...' : '이력서 양식 다운로드'}
          </button>
          <span className="text-[11.5px] text-[#6A7282]">
            제공된 양식의 작성란을 빠짐없이 채운 후 제출해주세요.
          </span>
        </div>

        <input
          type="file"
          ref={resumeRef}
          accept=".docx"
          onChange={(e) => handleResumeChange(e.target.files?.[0] ?? null)}
          className="hidden"
        />

        {form.resumeFile ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#CFEE5D] bg-[#F1FFC1]">
            <div className="flex items-center gap-2">
              <span className="text-[#A8D014]">✓</span>
              <div>
                <p className="text-[13px] font-medium text-[#1E2125]">{form.resumeFile.name}</p>
                <p className="text-[11.5px] text-[#6A7282]">
                  {formatFileSize(form.resumeFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, resumeFile: null }))}
              className="text-[#6A7282] hover:text-[#FF5E5E] cursor-pointer text-[16px]"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsResumeDragging(true);
            }}
            onDragLeave={() => setIsResumeDragging(false)}
            onDrop={handleResumeDrop}
            className={`flex items-center justify-between px-4 py-3 rounded-lg border border-dashed transition-colors ${
              isResumeDragging
                ? 'border-[#FF5E5E] bg-[#FFEBEB]'
                : (isError && !isResumeValid) || resumeError
                  ? 'border-[#FF5E5E] bg-[#F9FAFB]'
                  : 'border-[#D1D5DB] bg-[#F9FAFB]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[#6A7282]">↑</span>
              <div>
                <p className="text-[13px] text-[#6A7282]">파일을 드래그하거나 선택하세요</p>
                <p className="text-[11.5px] text-[#6A7282]">DOCX</p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => resumeRef.current?.click()}
              className="h-9 px-4 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] cursor-pointer shrink-0"
            >
              파일 선택
            </Button>
          </div>
        )}
        {resumeError && <p className={fieldErrorCls}>⚠ {resumeError}</p>}
        {isError && !isResumeValid && !resumeError && (
          <p className={fieldErrorCls}>⚠ 이력서를 첨부해주세요.</p>
        )}
      </div>

      {/* 포트폴리오 (필수) - shadcn Input */}
      <div>
        <label htmlFor="portfolioUrl" className={labelCls}>
          포트폴리오 <span className="text-[#FF5E5E]">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6A7282] text-[13px]">
            🔗
          </span>
          <Input
            id="portfolioUrl"
            type="url"
            placeholder="포트폴리오 링크를 입력해주세요. (GitHub, Notion 등)"
            value={form.portfolioUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
            aria-invalid={isError && !isPortfolioValid}
            className={`h-11 pl-9 pr-4 text-[13.5px] ${
              isError && !isPortfolioValid ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
            }`}
          />
        </div>
        {isError && !isPortfolioValid && (
          <p className={fieldErrorCls}>⚠ 포트폴리오 링크를 입력해주세요.</p>
        )}
      </div>

      {/* 동의 체크박스 */}
      <fieldset className="flex flex-col gap-2 px-1 mt-8 mb-4">
        <legend className="sr-only">필수 동의 항목</legend>
        <CheckboxItem
          id="agreePrivacy"
          checked={form.agreePrivacy}
          onChange={(checked) => setForm((prev) => ({ ...prev, agreePrivacy: checked }))}
        >
          개인정보 활용에 동의합니다. <span className="text-[#FF5E5E]">(필수)</span>
        </CheckboxItem>
        <CheckboxItem
          id="agreePublicProfile"
          checked={form.agreePublicProfile}
          onChange={(checked) => setForm((prev) => ({ ...prev, agreePublicProfile: checked }))}
        >
          강사 승인이 될 경우 입력한 정보가 학생에게 공개됨에 동의합니다.{' '}
          <span className="text-[#FF5E5E]">(필수)</span>
        </CheckboxItem>
        {isError && !isAgreeValid && (
          <p className={fieldErrorCls}>⚠ 필수 동의 항목에 모두 체크해주세요.</p>
        )}
      </fieldset>

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
          disabled={!isValid}
          className={`h-12 font-semibold text-[14px] transition-colors ${
            isValid
              ? 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
              : 'bg-[#E5E7EB] text-[#6A7282] cursor-not-allowed hover:bg-[#E5E7EB]'
          }`}
        >
          강사 지원하기
        </Button>
      </div>

      {/* 확인 모달 */}
      {confirmModal && (
        <TwoButtonModal
          title="강사 지원"
          message="강사 지원서를 제출하시겠습니까?"
          confirmLabel="지원하기"
          cancelLabel="취소"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmModal(false)}
        />
      )}
    </div>
  );
}