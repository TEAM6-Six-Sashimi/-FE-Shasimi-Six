'use client';

import { useRef, useState, useEffect } from 'react';
import Checkbox from '@/components/ui/Checkbox';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';
import { getVideoDuration } from '../utils/getVideoDuration';
import { getThumbnailUrl } from '@/lib/thumbnail';
import type { Session } from '@/features/user/mycourses-instructor/types';

export const SESSION_TITLE_MAX = 50;

const ALLOWED_MATERIAL_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

interface SessionItemProps {
  session: Session;
  index: number;
  canRemove: boolean;
  onUpdate: <K extends keyof Session>(id: number, key: K, value: Session[K]) => void;
  onRemove: (id: number) => void;
  onUploadingChange: (value: boolean) => void;
}

const formatFileSizeKB = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;
const formatFileSizeMB = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

export default function SessionItem({
  session,
  index,
  canRemove,
  onUpdate,
  onRemove,
  onUploadingChange,
}: SessionItemProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const materialInputRef = useRef<HTMLInputElement>(null);
  const [videoError, setVideoError] = useState('');
  const [materialError, setMaterialError] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);
  const [materialUploading, setMaterialUploading] = useState(false);

  useEffect(() => {
    onUploadingChange(videoUploading || materialUploading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUploading, materialUploading]);

  useEffect(() => {
    if (!session.videoFile) {
      setVideoPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(session.videoFile);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [session.videoFile]);

  // 기존 파일 데이터 (수정 시 이미 등록된 회차) — 새 파일을 고르지 않았으면 이걸로 표시
  // videoUrl은 업로드 API가 내려주는 상대 경로(key)일 수 있어 getThumbnailUrl로 절대 URL로 변환한다.
  const existingVideoUrl =
    !session.videoFile && session.videoUrl ? (getThumbnailUrl(session.videoUrl) ?? '') : '';
  const existingMaterialName =
    !session.materialFile && session.materialName ? session.materialName : '';
  const existingMaterialSize =
    !session.materialFile && session.materialSize ? session.materialSize : 0;

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
    if (!isMp4) {
      setVideoError('mp4 형식의 영상만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }
    setVideoError('');

    try {
      const durationSeconds = await getVideoDuration(file);

      onUpdate(session.id, 'videoFile', file);
      onUpdate(session.id, 'videoUrl', '');
      onUpdate(session.id, 'durationSeconds', durationSeconds);

      setVideoUploading(true);

      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('/api/upload/video', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('업로드 실패');

      const data = await res.json();
      onUpdate(session.id, 'videoUrl', data.url);
    } catch {
      onUpdate(session.id, 'videoUrl', '');
      onUpdate(session.id, 'durationSeconds', 0);
      setVideoError('영상 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setVideoUploading(false);
    }
  };

  const handleMaterialChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isAllowed =
      ALLOWED_MATERIAL_TYPES.includes(file.type) ||
      file.name.toLowerCase().endsWith('.pdf') ||
      file.name.toLowerCase().endsWith('.docx');

    if (!isAllowed) {
      setMaterialError('pdf 또는 docx 파일만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }
    setMaterialError('');
    onUpdate(session.id, 'materialFile', file);
    onUpdate(session.id, 'materialUrl', '');
    onUpdate(session.id, 'materialName', '');

    try {
      setMaterialUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/attachment', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('업로드 실패');
      const data = await res.json();
      onUpdate(session.id, 'materialUrl', data.url);
    } catch {
      setMaterialError('자료 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setMaterialUploading(false);
    }
  };

  const removeMaterial = () => {
    onUpdate(session.id, 'materialFile', null);
    onUpdate(session.id, 'materialName', '');
    onUpdate(session.id, 'materialUrl', '');
    onUpdate(session.id, 'materialType', '');
    onUpdate(session.id, 'materialSize', 0);
    if (materialInputRef.current) materialInputRef.current.value = '';
  };

  const inputCls =
    'w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

  return (
    <li className="flex flex-col gap-3 p-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] list-none">
      <header className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-[#CFEE5D] text-[#1E2125] text-[12px] font-bold">
          회차 {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(session.id)}
            aria-label={`회차 ${index + 1} 삭제`}
            className="text-[#6A7282] hover:text-[#FF5E5E] text-[17px] transition-colors cursor-pointer"
          >
            ✕
          </button>
        )}
      </header>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={`session-title-${session.id}`}
            className="text-[12.5px] font-semibold text-[#1E2125]"
          >
            소제목 <span className="text-[#FF5E5E]">*</span>
          </label>
          <span className="text-[11px] text-[#9CA3AF]">
            {session.title.length}/{SESSION_TITLE_MAX}
          </span>
        </div>
        <input
          id={`session-title-${session.id}`}
          type="text"
          placeholder="강의 회차 제목을 입력하세요"
          value={session.title}
          onChange={(e) =>
            onUpdate(session.id, 'title', e.target.value.slice(0, SESSION_TITLE_MAX))
          }
          maxLength={SESSION_TITLE_MAX}
          className={inputCls}
        />
      </div>

      {/* 강의 영상 영역 */}
      <div>
        <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
          강의 영상 <span className="text-[#FF5E5E]">*</span>
        </label>
        <input
          type="file"
          accept="video/mp4,.mp4"
          ref={videoInputRef}
          onChange={handleVideoChange}
          className="hidden"
          disabled={videoUploading}
        />
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          disabled={videoUploading}
          className={`w-full h-11 rounded-lg border border-dashed bg-white text-[13px] text-[#1E2125] hover:border-[#1E2125] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-70 ${
            videoError ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
          }`}
        >
          {videoUploading ? (
            <InlineDotsLoading />
          ) : (
            <>
              <span>↑</span>
              {session.videoFile
                ? `${session.videoFile.name} (${formatFileSizeMB(session.videoFile.size)})`
                : existingVideoUrl
                  ? '등록된 영상 있음 (변경하려면 클릭)'
                  : '영상 업로드'}
            </>
          )}
        </button>
        {videoError && <p className="text-[11px] text-[#FF5E5E] mt-1">{videoError}</p>}

        {(videoPreviewUrl || existingVideoUrl) && (
          <figure className="relative mt-2 w-full rounded-lg border border-[#E5E7EB] overflow-hidden bg-black">
            <video src={videoPreviewUrl || existingVideoUrl} controls className="w-full max-h-56" />
          </figure>
        )}
      </div>

      {/* 강의 자료 영역 */}
      <div>
        <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
          강의 자료 (선택, pdf/docx 1개)
        </label>
        <input
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ref={materialInputRef}
          onChange={handleMaterialChange}
          className="hidden"
          disabled={materialUploading}
        />

        {materialUploading ? (
          <div className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] bg-white flex items-center justify-center">
            <InlineDotsLoading />
          </div>
        ) : session.materialFile || existingMaterialName ? (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-dashed border-[#CFEE5D] bg-[#F1FFC1]">
            <div className="flex items-center gap-4">
              <span className="text-[#A8D014] font-bold">✓</span>
              <div>
                <p className="text-[13px] font-medium text-[#1E2125] truncate max-w-112.5">
                  {session.materialFile?.name ?? existingMaterialName}
                </p>
                {(session.materialFile?.size || existingMaterialSize > 0) && (
                  <p className="text-[11.5px] text-[#6A7282]">
                    {session.materialFile
                      ? formatFileSizeKB(session.materialFile.size)
                      : formatFileSizeKB(existingMaterialSize)}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={removeMaterial}
              className="text-[#6A7282] hover:text-[#FF5E5E] text-[13px] cursor-pointer"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => materialInputRef.current?.click()}
            className={`w-full h-11 rounded-lg border border-dashed bg-white text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              materialError ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
            }`}
          >
            <span>↑</span> 자료 업로드
          </button>
        )}
        {materialError && <p className="text-[11px] text-[#FF5E5E] mt-1">{materialError}</p>}
      </div>

      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <Checkbox
          checked={session.preview ?? false}
          onChange={(checked) => onUpdate(session.id, 'preview', checked)}
          color="#CFEE5D"
          checkColor="#1E2125"
        />
        <span className="text-[13px] text-[#1E2125]">무료 공개</span>
      </label>
    </li>
  );
}
