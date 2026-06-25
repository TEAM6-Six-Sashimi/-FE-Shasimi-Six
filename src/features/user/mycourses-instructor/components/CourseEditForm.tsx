'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import FullScreenLoading from '@/components/ui/FullScreenLoading';
import type { Category } from '@/features/categories/types';
import type {
  CourseEditFormData,
  Session,
  UpdateCourseRequest,
} from '@/features/user/mycourses-instructor/types';
import { updateCourseAction } from '../actions';
import Image from 'next/image';

interface CourseEditFormProps {
  categories: Category[];
  initialData: CourseEditFormData;
}

const LEVELS = ['초급', '중급', '고급'] as const;

const DIFFICULTY_MAP: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'> = {
  초급: 'BEGINNER',
  중급: 'INTERMEDIATE',
  고급: 'ADVANCED',
};

const TITLE_MAX = 50;
const DESCRIPTION_MAX = 500;
const SESSION_TITLE_MAX = 50;
const SESSION_MAX_COUNT = 50;

const DEFAULT_SESSION: Omit<Session, 'id'> = {
  title: '',
  videoFile: null,
  videoUrl: '',
  materialFile: null,
  materialUrl: '',
  preview: false,
};

const MODAL_CONFIG = {
  save: {
    title: '변경된 정보를 임시 저장 하시겠습니까?',
    message: '강의가 보관 상태로 저장되며 목록으로 돌아갑니다.',
  },
  submit: {
    title: '변경된 내용으로 강의 승인을 요청하시겠습니까?',
    message: '승인 요청 후 관리자 검토를 거쳐 수강생에게 공개됩니다.',
  },
  cancel: {
    title: '작성 중인 내용이 있습니다.\n페이지를 나가시겠습니까?',
    message: '저장되지 않은 내용은 사라집니다.',
  },
};

interface FieldErrors {
  title?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  price?: string;
  level?: string;
  thumbnail?: string;
  sessions?: string;
  agreement?: string;
}

export default function CourseEditForm({ categories, initialData }: CourseEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('처리 중입니다...');
  const [form, setForm] = useState<CourseEditFormData>(initialData);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [confirmModal, setConfirmModal] = useState<{
    type: 'save' | 'submit' | 'cancel';
  } | null>(null);

  const subCategories = categories.find((c) => c.name === form.category)?.options ?? [];

  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>('');

  // 새 파일 업로드 시에만 objectURL 생성, 없을 시에는 기존 thumbnail URL 유지
  useEffect(() => {
    if (!form.thumbnailFile) {
      setThumbnailPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(form.thumbnailFile);
    setThumbnailPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.thumbnailFile]);

  const handleField = <K extends keyof CourseEditFormData>(
    key: K,
    value: CourseEditFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value, subCategory: '' }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, thumbnail: '이미지 파일만 업로드할 수 있습니다.' }));
      return;
    }

    try {
      setThumbnailUploading(true);
      setErrors((prev) => ({ ...prev, thumbnail: undefined }));
      setForm((prev) => ({ ...prev, thumbnailFile: file }));
    } catch {
      setErrors((prev) => ({ ...prev, thumbnail: '이미지 업로드에 실패했습니다.' }));
    } finally {
      setThumbnailUploading(false);
    }
  };

  const updateSession = <K extends keyof Session>(id: number, key: K, value: Session[K]) => {
    setForm((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
  };

  const addSession = () => {
    if (form.sessions.length >= SESSION_MAX_COUNT) return;
    setForm((prev) => ({
      ...prev,
      sessions: [...prev.sessions, { id: Date.now(), ...DEFAULT_SESSION }],
    }));
  };

  const removeSession = (id: number) => {
    if (form.sessions.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== id),
    }));
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!form.title.trim()) next.title = '강의 제목을 입력해주세요.';
    else if (form.title.length > TITLE_MAX)
      next.title = `강의 제목은 ${TITLE_MAX}자 이하로 입력해주세요.`;

    if (!form.description.trim()) next.description = '강의 설명을 입력해주세요.';
    else if (form.description.length > DESCRIPTION_MAX)
      next.description = `강의 설명은 ${DESCRIPTION_MAX}자 이하로 입력해주세요.`;

    if (!form.category) next.category = '카테고리를 선택해주세요.';
    if (!form.subCategory) next.subCategory = '세부 카테고리를 선택해주세요.';
    if (form.price === '') next.price = '가격을 입력해주세요.';
    if (!form.level) next.level = '난이도를 선택해주세요.';
    if (!form.thumbnailFile && !form.thumbnail) next.thumbnail = '대표 이미지를 업로드해주세요.';

    if (form.sessions.length === 0) {
      next.sessions = '최소 1개 이상의 회차가 필요합니다.';
    } else if (form.sessions.some((s) => !s.title.trim() || (!s.videoFile && !s.videoUrl))) {
      next.sessions = '모든 회차의 소제목과 강의 영상을 입력해주세요.';
    } else if (form.sessions.some((s) => s.title.length > SESSION_TITLE_MAX)) {
      next.sessions = `회차 소제목은 ${SESSION_TITLE_MAX}자 이하로 입력해주세요.`;
    }

    if (!agreed) next.agreement = '강의 판매 정책에 동의해주세요.';

    return next;
  };

  const handleSubmit = async (type: 'save' | 'submit') => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const selectedCat = categories.find((c) => c.name === form.category);
    const selectedSub = selectedCat?.options.find((o) => String(o.id) === form.subCategory);
    if (!selectedSub) {
      setErrors((prev) => ({ ...prev, subCategory: '세부 카테고리를 다시 선택해주세요.' }));
      return;
    }

    const payload: UpdateCourseRequest = {
      categoryId: selectedSub.id,
      title: form.title,
      description: form.description,
      price: form.price as number,
      difficulty: DIFFICULTY_MAP[form.level],
      thumbnail: form.thumbnail,
      targetStatus: type === 'save' ? 'DRAFT' : 'PENDING',
      sessions: form.sessions.map((s) => ({
        title: s.title,
        videoUrl: s.videoUrl,
        preview: s.preview,
        attachmentName: s.materialFile?.name ?? s.materialName,
        attachmentUrl: s.materialUrl,
        attachmentType: s.materialFile?.type ?? s.materialType,
        attachmentSize: s.materialFile?.size ?? s.materialSize,
      })),
    };

    try {
      setLoadingMessage(type === 'save' ? '임시 저장 중입니다...' : '승인 요청 중입니다...');
      setIsLoading(true);
      await updateCourseAction(form.courseId, payload);
      router.push('/mycourses-instructor?tab=pending');
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        sessions: error.message || '강의 수정에 실패했습니다.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || !agreed;

  const inputCls =
    'w-full h-11 px-4 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';
  const labelCls = 'block text-[13px] font-semibold text-[#1E2125] mb-1.5';
  const requiredMark = <span className="text-[#FF5E5E] ml-0.5">*</span>;
  const fieldErrorCls = 'text-[12px] text-[#FF5E5E] mt-1';

  const borderCls = (hasError?: string) => (hasError ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]');

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {isLoading && <FullScreenLoading message={loadingMessage} />}
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-8">
        <h1 className="text-[22px] font-bold text-[#1E2125]">강의 수정</h1>

        {/* ── 기본 정보 ── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-[16px] font-bold text-[#1E2125] pb-2 border-b border-[#E5E7EB]">
            기본 정보
          </h2>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-semibold text-[#1E2125]">
                강의 제목{requiredMark}
              </label>
              <span className="text-[12px] text-[#9CA3AF]">
                {form.title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              type="text"
              placeholder="강의 제목을 입력하세요"
              value={form.title}
              onChange={(e) => handleField('title', e.target.value.slice(0, TITLE_MAX))}
              maxLength={TITLE_MAX}
              disabled={isLoading}
              className={`${inputCls} ${borderCls(errors.title)}`}
            />
            {errors.title && <p className={fieldErrorCls}>{errors.title}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-semibold text-[#1E2125]">
                강의 설명{requiredMark}
              </label>
              <span className="text-[12px] text-[#9CA3AF]">
                {form.description.length}/{DESCRIPTION_MAX}
              </span>
            </div>
            <textarea
              placeholder="강의 설명을 입력하세요"
              value={form.description}
              onChange={(e) =>
                handleField('description', e.target.value.slice(0, DESCRIPTION_MAX))
              }
              maxLength={DESCRIPTION_MAX}
              rows={5}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none ${borderCls(errors.description)}`}
            />
            {errors.description && <p className={fieldErrorCls}>{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>카테고리{requiredMark}</label>
              <Select
                value={form.category}
                onValueChange={handleCategoryChange}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`h-11! text-[13.5px] text-[#1E2125] ${borderCls(errors.category)}`}
                >
                  <SelectValue placeholder="셀렉트박스" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name} className="text-[13px]">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className={fieldErrorCls}>{errors.category}</p>}
            </div>
            <div>
              <label className={labelCls}>세부 카테고리{requiredMark}</label>
              <Select
                value={form.subCategory}
                onValueChange={(v) => handleField('subCategory', v)}
                disabled={!form.category || isLoading}
              >
                <SelectTrigger
                  className={`h-11! text-[13.5px] text-[#1E2125] ${borderCls(errors.subCategory)}`}
                >
                  <SelectValue placeholder="셀렉트박스" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {subCategories.map((sub) => (
                    <SelectItem key={sub.id} value={String(sub.id)} className="text-[13px]">
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subCategory && <p className={fieldErrorCls}>{errors.subCategory}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>가격 (크레딧){requiredMark}</label>
              <input
                type="number"
                placeholder="0"
                value={form.price}
                onChange={(e) =>
                  handleField('price', e.target.value === '' ? '' : Number(e.target.value))
                }
                min={0}
                disabled={isLoading}
                className={`${inputCls} ${borderCls(errors.price)}`}
              />
              {errors.price && <p className={fieldErrorCls}>{errors.price}</p>}
            </div>
            <div>
              <label className={labelCls}>난이도{requiredMark}</label>
              <Select
                value={form.level}
                onValueChange={(v) => handleField('level', v)}
                disabled={isLoading}
              >
                <SelectTrigger
                  className={`h-11! text-[13.5px] text-[#1E2125] ${borderCls(errors.level)}`}
                >
                  <SelectValue placeholder="셀렉트박스" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {LEVELS.map((lv) => (
                    <SelectItem key={lv} value={lv} className="text-[13px]">
                      {lv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.level && <p className={fieldErrorCls}>{errors.level}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>대표 이미지{requiredMark}</label>
            <input
              type="file"
              accept="image/*"
              ref={thumbnailRef}
              onChange={handleThumbnailUpload}
              className="hidden"
              disabled={isLoading || thumbnailUploading}
            />
            <Button
              type="button"
              onClick={() => thumbnailRef.current?.click()}
              disabled={isLoading || thumbnailUploading}
              className={`w-full h-12 rounded-lg border border-dashed bg-[#F9FAFB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] hover:bg-[#F9FAFB] flex items-center justify-center gap-2 disabled:opacity-70 ${
                errors.thumbnail ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
              }`}
            >
              {thumbnailUploading ? (
                <LoadingDots />
              ) : (
                <>
                  <span>↑</span>
                  {form.thumbnailFile || form.thumbnail
                    ? '이미지 변경하기'
                    : '강의 대표 이미지를 업로드하세요'}
                </>
              )}
            </Button>
            {errors.thumbnail && <p className={fieldErrorCls}>{errors.thumbnail}</p>}
            
            {/* 💡 썸네일 노출: 새 파일(thumbnailPreviewUrl)이 있으면 우선 노출, 없으면 기존 원본 URL(form.thumbnail)을 상시 유지 */}
            {(thumbnailPreviewUrl || form.thumbnail) && (
              <div className="relative mt-2 w-full h-40 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F3F4F6]">
                <Image
                  src={thumbnailPreviewUrl || form.thumbnail}
                  alt="썸네일 미리보기"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* ── 커리큘럼 ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <h2 className="text-[16px] font-bold text-[#1E2125]">커리큘럼</h2>
            <span className="text-[12px] text-[#9CA3AF]">
              {form.sessions.length}/{SESSION_MAX_COUNT}
            </span>
          </div>

          {form.sessions.map((session, idx) => (
            <SessionItem
              key={session.id}
              session={session}
              index={idx}
              canRemove={form.sessions.length > 1}
              onUpdate={updateSession}
              onRemove={removeSession}
              titleMax={SESSION_TITLE_MAX}
            />
          ))}

          {errors.sessions && <p className={fieldErrorCls}>{errors.sessions}</p>}

          <Button
            type="button"
            onClick={addSession}
            disabled={isLoading || form.sessions.length >= SESSION_MAX_COUNT}
            className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] bg-transparent text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] hover:bg-transparent flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span className="text-[16px]">+</span> 회차 추가
          </Button>
        </section>

        {/* ── 동의 영역 ── */}
        <section className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4 flex flex-col gap-2">
          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) {
                  setErrors((prev) => ({ ...prev, agreement: undefined }));
                }
              }}
              disabled={isLoading}
              className="w-4 h-4 accent-[#CFEE5D] cursor-pointer"
            />
            <span className="text-[13.5px] font-semibold text-[#1E2125]">
              강의 판매 정책에 동의합니다. <span className="text-[#FF5E5E]">(필수)</span>
            </span>
          </label>
          <ul className="text-[12px] text-[#6A7282] pl-1 flex flex-col gap-0.5">
            <li>· 강의는 관리자 승인일로부터 2년 후 자동으로 비공개 처리됩니다.</li>
            <li>· 비공개 처리 시 신규 수강 신청이 불가하며, 기존 수강생은 이후 2년간 수강할 수 있습니다.</li>
            <li>· 비공개 전 강사에게 알림이 발송됩니다.</li>
          </ul>
          {errors.agreement && <p className={fieldErrorCls}>{errors.agreement}</p>}
        </section>

        {/* ── 버튼 ── */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            onClick={() => setConfirmModal({ type: 'save' })}
            disabled={isSubmitDisabled}
            className={`h-11 px-7 font-semibold text-[14px] transition-colors ${
              isSubmitDisabled
                ? 'bg-[#E5E7EB] text-[#6A7282] cursor-not-allowed hover:bg-[#E5E7EB]'
                : 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
            }`}
          >
            {isLoading ? <LoadingDots color="#6A7282" /> : '수정 완료'}
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setConfirmModal({ type: 'submit' })}
              disabled={isSubmitDisabled}
              className={`h-11 px-7 font-semibold text-[14px] transition-colors ${
                isSubmitDisabled
                  ? 'bg-[#E5E7EB] text-[#6A7282] cursor-not-allowed hover:bg-[#E5E7EB]'
                  : 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
              }`}
            >
              {isLoading ? <LoadingDots color="#6A7282" /> : '승인 요청'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmModal({ type: 'cancel' })}
              disabled={isLoading}
              className="h-11 px-7 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
            >
              취소
            </Button>
          </div>
        </div>
      </div>

      {/* ── 확인 모달 ── */}
      {confirmModal && (
        <TwoButtonModal
          title={MODAL_CONFIG[confirmModal.type].title}
          message={MODAL_CONFIG[confirmModal.type].message}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setConfirmModal(null);
            if (confirmModal.type === 'cancel') {
              router.back();
            } else {
              handleSubmit(confirmModal.type);
            }
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}

function LoadingDots({ color = '#1E2125' }: { color?: string }) {
  return (
    <span className="flex items-center gap-1">
      {[0, 150, 300].map((delay, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: color,
            animation: 'inline-loading-bounce 0.6s ease-in-out infinite',
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
      <style>{`
        @keyframes inline-loading-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

// ── 세션 아이템 (커리큘럼 단일 회차 요소) ──────────────────────────────────
interface SessionItemProps {
  session: Session;
  index: number;
  canRemove: boolean;
  onUpdate: <K extends keyof Session>(id: number, key: K, value: Session[K]) => void;
  onRemove: (id: number) => void;
  titleMax: number;
}

const ALLOWED_MATERIAL_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function SessionItem({
  session,
  index,
  canRemove,
  onUpdate,
  onRemove,
  titleMax,
}: SessionItemProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const materialInputRef = useRef<HTMLInputElement>(null);
  const [videoError, setVideoError] = useState('');
  const [materialError, setMaterialError] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');

  const formatFileSizeKB = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;
  const formatFileSizeMB = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  useEffect(() => {
    if (!session.videoFile) {
      setVideoPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(session.videoFile);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [session.videoFile]);

  // 기존 파일 데이터 수납 처리
  const existingVideoUrl = !session.videoFile && session.videoUrl ? session.videoUrl : '';
  const existingMaterialName = !session.materialFile && session.materialName ? session.materialName : '';
  const existingMaterialSize = !session.materialFile && session.materialSize ? session.materialSize : 0;

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
    if (!isMp4) {
      setVideoError('mp4 형식의 영상만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }
    setVideoError('');
    onUpdate(session.id, 'videoFile', file);
  };

  const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const removeMaterial = () => {
    onUpdate(session.id, 'materialFile', null);
    onUpdate(session.id, 'materialName', '');
    onUpdate(session.id, 'materialUrl', '');
    if (materialInputRef.current) materialInputRef.current.value = '';
  };

  const inputCls =
    'w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-[#CFEE5D] text-[#1E2125] text-[12px] font-bold">
          회차 {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(session.id)}
            className="text-[#6A7282] hover:text-[#FF5E5E] text-[17px] transition-colors cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12.5px] font-semibold text-[#1E2125]">
            소제목 <span className="text-[#FF5E5E]">*</span>
          </label>
          <span className="text-[11px] text-[#9CA3AF]">
            {session.title.length}/{titleMax}
          </span>
        </div>
        <input
          type="text"
          placeholder="강의 회차 제목을 입력하세요"
          value={session.title}
          onChange={(e) => onUpdate(session.id, 'title', e.target.value.slice(0, titleMax))}
          maxLength={titleMax}
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
        />
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className={`w-full h-11 rounded-lg border border-dashed bg-white text-[13px] text-[#1E2125] hover:border-[#1E2125] flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            videoError ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
          }`}
        >
          <span>↑</span>
          {/* 영상 데이터 상시 표시: 파일이 교체되면 파일명+MB용량, 교체 전 상태면 원본 영상 식별 텍스트 출력 */}
          {session.videoFile
            ? `${session.videoFile.name} (${formatFileSizeMB(session.videoFile.size)})`
            : existingVideoUrl
              ? `등록된 영상 있음 (변경하려면 클릭)`
              : '영상 업로드'}
        </button>
        {videoError && <p className="text-[11px] text-[#FF5E5E] mt-1">{videoError}</p>}

        {/* 비디오 엘리먼트 상시 유지: 새로 넣은 blob 주소 또는 기존 URL 중 존재하는 것을 재생 */}
        {(videoPreviewUrl || existingVideoUrl) && (
          <div className="relative mt-2 w-full rounded-lg border border-[#E5E7EB] overflow-hidden bg-black">
            <video src={videoPreviewUrl || existingVideoUrl} controls className="w-full max-h-56" />
          </div>
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
        />
        
        {/* 자료 데이터 상시 유지: 파일 객체가 존재하거나, 혹은 기존에 넘어온 파일명 정보가 존재하는 경우 연두색 박스로 고정 */}
        {session.materialFile || existingMaterialName ? (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-dashed border-[#CFEE5D] bg-[#F1FFC1]">
            <div className="flex items-center gap-4">
              <span className="text-[#A8D014] font-bold">✓</span>
              <div>
                <p className="text-[13px] font-medium text-[#1E2125] truncate max-w-112.5">
                  {session.materialFile?.name ?? existingMaterialName}
                </p>
                {/* 용량 정보가 수치(bytes)로 존재할 때만 크기 표시 */}
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
        <input
          type="checkbox"
          checked={session.preview ?? false}
          onChange={(e) => onUpdate(session.id, 'preview', e.target.checked)}
          className="w-4 h-4 accent-[#CFEE5D] cursor-pointer"
        />
        <span className="text-[13px] text-[#1E2125]">무료 공개</span>
      </label>
    </div>
  );
}