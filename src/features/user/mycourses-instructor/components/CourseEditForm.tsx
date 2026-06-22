'use client';

import { useRef, useState } from 'react';
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

const DEFAULT_SESSION: Omit<Session, 'id'> = {
  title: '',
  videoUrl: '',
  materialFile: '',
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
    try {
      setThumbnailUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('업로드 실패');
      const data = await res.json();
      handleField('thumbnail', data.url);
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

  // ── 유효성 검사 ──────────────────────────────────────────────
  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!form.title.trim()) next.title = '강의 제목을 입력해주세요.';
    if (!form.description.trim()) next.description = '강의 설명을 입력해주세요.';
    if (!form.category) next.category = '카테고리를 선택해주세요.';
    if (!form.subCategory) next.subCategory = '세부 카테고리를 선택해주세요.';
    if (form.price === '') next.price = '가격을 입력해주세요.';
    if (!form.level) next.level = '난이도를 선택해주세요.';
    if (!form.thumbnail) next.thumbnail = '대표 이미지를 업로드해주세요.';
    if (form.sessions.some((s) => !s.title.trim() || !s.videoUrl.trim())) {
      next.sessions = '모든 회차의 소제목과 영상 URL을 입력해주세요.';
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

  // 동의 체크 안 했으면 버튼 비활성화 (제출 버튼들만; 취소는 항상 가능)
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

        <section className="flex flex-col gap-5">
          <h2 className="text-[16px] font-bold text-[#1E2125] pb-2 border-b border-[#E5E7EB]">
            기본 정보
          </h2>

          <div>
            <label className={labelCls}>강의 제목{requiredMark}</label>
            <input
              type="text"
              placeholder="강의 제목을 입력하세요"
              value={form.title}
              onChange={(e) => handleField('title', e.target.value)}
              disabled={isLoading}
              className={`${inputCls} ${borderCls(errors.title)}`}
            />
            {errors.title && <p className={fieldErrorCls}>{errors.title}</p>}
          </div>

          <div>
            <label className={labelCls}>강의 설명{requiredMark}</label>
            <textarea
              placeholder="강의 설명을 입력하세요"
              value={form.description}
              onChange={(e) => handleField('description', e.target.value)}
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

          {/* 대표 이미지 */}
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
              <span>↑</span>
              {thumbnailUploading
                ? '업로드 중...'
                : form.thumbnail
                  ? '이미지 변경하기'
                  : '강의 대표 이미지를 업로드하세요'}
            </Button>
            {errors.thumbnail && <p className={fieldErrorCls}>{errors.thumbnail}</p>}
            {form.thumbnail && (
              <div className="relative mt-2 w-full h-40 rounded-lg border border-[#E5E7EB] overflow-hidden">
                <Image
                  src={form.thumbnail}
                  alt="썸네일 미리보기"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-[#1E2125] pb-2 border-b border-[#E5E7EB]">
            커리큘럼
          </h2>

          {form.sessions.map((session, idx) => (
            <SessionItem
              key={session.id}
              session={session}
              index={idx}
              canRemove={form.sessions.length > 1}
              onUpdate={updateSession}
              onRemove={removeSession}
            />
          ))}

          {errors.sessions && <p className={fieldErrorCls}>{errors.sessions}</p>}

          <Button
            type="button"
            onClick={addSession}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] bg-transparent text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] hover:bg-transparent flex items-center justify-center gap-1.5"
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
            {isLoading ? '저장 중...' : '수정 완료'}
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
              {isLoading ? '처리 중...' : '승인 요청'}
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

// ── 세션 아이템 ──────────────────────────────────────────────────
interface SessionItemProps {
  session: Session;
  index: number;
  canRemove: boolean;
  onUpdate: <K extends keyof Session>(id: number, key: K, value: Session[K]) => void;
  onRemove: (id: number) => void;
}

function SessionItem({ session, index, canRemove, onUpdate, onRemove }: SessionItemProps) {
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
            className="text-[#6A7282] hover:text-[#FF5E5E] text-[13px] transition-colors cursor-pointer"
          >
            삭제
          </button>
        )}
      </div>

      <div>
        <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
          소제목 <span className="text-[#FF5E5E]">*</span>
        </label>
        <input
          type="text"
          placeholder="강의 회차 제목을 입력하세요"
          value={session.title}
          onChange={(e) => onUpdate(session.id, 'title', e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
            강의 영상 <span className="text-[#FF5E5E]">*</span>
          </label>
          <input
            type="url"
            placeholder="영상 URL을 입력하세요"
            value={session.videoUrl}
            onChange={(e) => onUpdate(session.id, 'videoUrl', e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
            강의 자료 (선택)
          </label>
          <input
            type="text"
            placeholder="자료 URL을 입력하세요"
            value={session.materialFile}
            onChange={(e) => onUpdate(session.id, 'materialFile', e.target.value)}
            className={inputCls}
          />
        </div>
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