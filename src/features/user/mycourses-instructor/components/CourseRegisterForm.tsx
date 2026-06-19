'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Category } from '@/features/categories/types';

import type {
  CourseFormData,
  CreateCourseRequest,
  Session,
} from '@/features/user/mycourses-instructor/types';
import { createCourseAction } from '../actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import Image from 'next/image';

// ── 타입 ────────────────────────────────────────────────────────
interface CourseRegisterFormProps {
  categories: Category[];
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

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function CourseRegisterForm({ categories }: CourseRegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    level: '',
    thumbnail: '',
    sessions: [{ id: 1, ...DEFAULT_SESSION }],
  });

  const [confirmModal, setConfirmModal] = useState<{
    type: 'save' | 'submit' | 'cancel';
  } | null>(null);

  const MODAL_CONFIG = {
    save: { title: '임시 저장', message: '임시 저장하시겠습니까?' },
    submit: { title: '승인 요청', message: '승인 요청하시겠습니까?' },
    cancel: { title: '취소', message: '작성을 취소하시겠습니까?\n작성된 내용이 사라집니다.' },
  };

  const subCategories = categories.find((c) => c.name === form.category)?.options ?? [];

  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  // ── 기본정보 핸들러 ──────────────────────────────────────────
  const handleField = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
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
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setThumbnailUploading(false);
    }
  };

  // ── 세션 핸들러 ──────────────────────────────────────────────
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

  // ── 제출 ────────────────────────────────────────────────────
  const handleSubmit = async (type: 'save' | 'submit') => {
    if (!form.title.trim()) {
      alert('강의 제목을 입력해주세요.');
      return;
    }
    if (!form.description.trim()) {
      alert('강의 설명을 입력해주세요.');
      return;
    }
    if (!form.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!form.subCategory) {
      alert('세부 카테고리를 선택해주세요.');
      return;
    }
    if (form.price === '') {
      alert('가격을 입력해주세요.');
      return;
    }
    if (!form.level) {
      alert('난이도를 선택해주세요.');
      return;
    }
    if (form.sessions.some((s) => !s.title.trim() || !s.videoUrl.trim())) {
      alert('모든 세션의 소제목과 영상 URL을 입력해주세요.');
      return;
    }

    const selectedCat = categories.find((c) => c.name === form.category);
    const selectedSub = selectedCat?.options.find((o) => String(o.id) === form.subCategory);
    if (!selectedSub) {
      alert('세부 카테고리를 다시 선택해주세요.');
      return;
    }

    const payload: CreateCourseRequest = {
      subCategoryName: selectedSub.name,
      title: form.title,
      description: form.description,
      price: form.price as number,
      difficulty: DIFFICULTY_MAP[form.level],
      thumbnail: form.thumbnail,
      initialStatus: type === 'save' ? 'DRAFT' : 'PENDING',
      sessions: form.sessions.map((s) => ({
        title: s.title,
        videoUrl: s.videoUrl,
        preview: s.preview,
      })),
    };

    try {
      setIsLoading(true);
      await createCourseAction(payload);
      router.push('/mycourses-instructor?tab=pending');
    } catch (error: any) {
      alert(error.message || '강의 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── 공통 인풋 스타일 ─────────────────────────────────────────
  const inputCls =
    'w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';
  const labelCls = 'block text-[13px] font-semibold text-[#1E2125] mb-1.5';
  const requiredMark = <span className="text-[#FF5E5E] ml-0.5">*</span>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-8">
        <h1 className="text-[22px] font-bold text-[#1E2125]">새 강의 등록</h1>

        {/* ── 기본 정보 ── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-[16px] font-bold text-[#1E2125] pb-2 border-b border-[#E5E7EB]">
            기본 정보
          </h2>

          {/* 강의 제목 */}
          <div>
            <label className={labelCls}>강의 제목{requiredMark}</label>
            <input
              type="text"
              placeholder="강의 제목을 입력하세요"
              value={form.title}
              onChange={(e) => handleField('title', e.target.value)}
              disabled={isLoading}
              className={inputCls}
            />
          </div>

          {/* 강의 설명 */}
          <div>
            <label className={labelCls}>강의 설명{requiredMark}</label>
            <textarea
              placeholder="강의 설명을 입력하세요"
              value={form.description}
              onChange={(e) => handleField('description', e.target.value)}
              rows={5}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none"
            />
          </div>

          {/* 카테고리 + 세부 카테고리 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>카테고리{requiredMark}</label>
              <Select
                value={form.category}
                onValueChange={handleCategoryChange}
                disabled={isLoading}
              >
                <SelectTrigger className="h-11! text-[13.5px] border-[#D1D5DB] text-[#1E2125]">
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
            </div>
            <div>
              <label className={labelCls}>세부 카테고리{requiredMark}</label>
              <Select
                value={form.subCategory}
                onValueChange={(v) => handleField('subCategory', v)}
                disabled={!form.category || isLoading}
              >
                <SelectTrigger className="h-11! text-[13.5px] border-[#D1D5DB] text-[#1E2125]">
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
            </div>
          </div>

          {/* 가격 + 난이도 */}
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
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>난이도{requiredMark}</label>
              <Select
                value={form.level}
                onValueChange={(v) => handleField('level', v)}
                disabled={isLoading}
              >
                <SelectTrigger className="h-11! text-[13.5px] border-[#D1D5DB] text-[#1E2125]">
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
              className="w-full h-12 rounded-lg border border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] hover:bg-[#F9FAFB] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span>↑</span>
              {thumbnailUploading
                ? '업로드 중...'
                : form.thumbnail
                  ? '이미지 변경하기'
                  : '강의 대표 이미지를 업로드하세요'}
            </Button>
            {form.thumbnail && (
              <Image
                src={form.thumbnail}
                alt="썸네일 미리보기"
                className="mt-2 w-full h-40 object-cover rounded-lg border border-[#E5E7EB]"
              />
            )}
          </div>
        </section>

        {/* ── 커리큘럼 ── */}
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

          <Button
            type="button"
            onClick={addSession}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] bg-transparent text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] hover:bg-transparent flex items-center justify-center gap-1.5"
          >
            <span className="text-[16px]">+</span> 세션 추가
          </Button>
        </section>

        {/* ── 버튼 ── */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            onClick={() => setConfirmModal({ type: 'save' })}
            disabled={isLoading}
            className="h-11 px-7 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-70"
          >
            {isLoading ? '저장 중...' : '임시 저장'}
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setConfirmModal({ type: 'submit' })}
              disabled={isLoading}
              className="h-11 px-7 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-70"
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
          세션 {index + 1}
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
          placeholder="세션 제목을 입력하세요"
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
