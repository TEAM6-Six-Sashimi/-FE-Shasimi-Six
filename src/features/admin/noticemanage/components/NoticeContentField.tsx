'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface NoticeContentFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const FONT_SIZE_OPTIONS = [
  { label: '작게', value: '12' },
  { label: '보통', value: '14' },
  { label: '크게', value: '18' },
  { label: '아주 크게', value: '24' },
];

export default function NoticeContentField({ value, onChange }: NoticeContentFieldProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  // 선택한 텍스트가 다시 선택되도록 커서 위치 복원
  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const selectionStart = start + before.length;
      textarea.setSelectionRange(selectionStart, selectionStart + selected.length);
    });
  };

  const handleBold = () => wrapSelection('**', '**', '볼드 텍스트');

  const handleFontSize = (size: string) => {
    if (!size) return;
    wrapSelection(`[size=${size}]`, '[/size]', '텍스트');
  };

  // 업로드된 이미지 URL을 현재 커서 위치에 마크다운 이미지로 삽입
  const insertImageMarkdown = (url: string) => {
    const markdown = `![공지 이미지](${url})`;
    const textarea = contentRef.current;

    if (!textarea) {
      onChange(`${value}${value ? '\n\n' : ''}${markdown}`);
      return;
    }

    const currentValue = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    onChange(`${currentValue.slice(0, start)}${markdown}${currentValue.slice(end)}`);

    requestAnimationFrame(() => {
      const pos = start + markdown.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    setImageError('');
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      insertImageMarkdown(data.url);
    } catch {
      setImageError('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          uploadImage(file);
        }
        break;
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadImage(file);
  };

  return (
    <div className="mb-2">
      <div className="flex mb-2">
        <p className="text-[15px] font-semibold text-[#1E2125]">내용</p>
        <p className="text-[#FF5F5F]">*</p>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={handleBold}
          aria-label="굵게"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-[#D1D5DB] text-[13px] font-bold text-[#1E2125] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
        >
          B
        </button>
        <select
          onChange={(e) => {
            handleFontSize(e.target.value);
            e.target.value = '';
          }}
          defaultValue=""
          aria-label="글씨 크기"
          className="h-8 px-2 rounded-md border border-[#D1D5DB] bg-white text-[12.5px] text-[#1E2125] outline-none cursor-pointer"
        >
          <option value="" disabled>
            글씨 크기
          </option>
          {FONT_SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <textarea
        ref={contentRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        placeholder="공지사항 내용을 입력하세요"
        className={`w-full h-64 px-4 py-3 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none transition-colors resize-none overflow-y-auto ${
          isDragging ? 'border-[#FF5F5F] bg-[#FFF5F5]' : 'border-[#D1D5DB] focus:border-[#1E2125]'
        }`}
      />
      <p className="flex items-center gap-1.5 text-[12px] text-[#6A7282] mt-1">
        <Image src="/image-Icon.svg" alt="" width={15} height={15} />
        {isUploadingImage
          ? '이미지 업로드 중...'
          : '이미지는 내용 입력창에 드래그하거나 붙여넣기(Ctrl+V)로 첨부할 수 있습니다.'}
      </p>
      {imageError && <p className="text-xs text-[#DC2626] mt-1">{imageError}</p>}
    </div>
  );
}
