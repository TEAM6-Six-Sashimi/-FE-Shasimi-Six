'use client';

import { useState } from 'react';
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
  CourseEditFormData,
  Session,
  UpdateCourseRequest,
} from '@/features/user/mycourses-instructor/types';
import { updateCourseAction } from '../actions';

// ── 타입 ───────────────────────────────────────────────────────
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
  isFree: false,
};

export default function CourseEditForm({ categories, initialData }: CourseEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<CourseEditFormData>(initialData);

  const subCategories = categories.find((c) => c.name === form.category)?.options ?? [];

  const handleField = <K extends keyof CourseEditFormData>(
    key: K,
    value: CourseEditFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value, subCategory: '' }));
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
      })),
    };

    try {
      setIsLoading(true);
      await updateCourseAction(form.courseId, payload);
      router.push('/mycourses-instructor?tab=pending');
    } catch (error: any) {
      alert(error.message || '강의 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';
  const labelCls = 'block text-[13px] font-semibold text-[#1E2125] mb-1.5';
  const requiredMark = <span className="text-[#FF5E5E] ml-0.5">*</span>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
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
              className={inputCls}
            />
          </div>

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

          <div>
            <label className={labelCls}>대표 이미지{requiredMark}</label>
            <input
              type="text"
              placeholder="썸네일 URL을 입력하세요"
              value={form.thumbnail}
              onChange={(e) => handleField('thumbnail', e.target.value)}
              disabled={isLoading}
              className={inputCls}
            />
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

          <button
            type="button"
            onClick={addSession}
            disabled={isLoading}
            className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="text-[16px]">+</span> 세션 추가
          </button>
        </section>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            onClick={() => handleSubmit('save')}
            disabled={isLoading}
            className="h-11 px-7 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-70"
          >
            {isLoading ? '저장 중...' : '수정 완료'}
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => handleSubmit('submit')}
              disabled={isLoading}
              className="h-11 px-7 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-70"
            >
              {isLoading ? '처리 중...' : '승인 요청'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="h-11 px-7 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
            >
              취소
            </Button>
          </div>
        </div>
      </div>
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
          checked={session.isFree}
          onChange={(e) => onUpdate(session.id, 'isFree', e.target.checked)}
          className="w-4 h-4 accent-[#CFEE5D] cursor-pointer"
        />
        <span className="text-[13px] text-[#1E2125]">무료 공개</span>
      </label>
    </div>
  );
}
