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

// ── 타입 ────────────────────────────────────────────────────────
interface Lecture {
  id: number;
  title: string;
  videoUrl: string;
  materialFile: File | null;
  isFree: boolean;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number | '';
  level: string;
  thumbnailFile: File | null;
  lectures: Lecture[];
}

interface CourseRegisterFormProps {
  categories: Category[];
}

const LEVELS = ['입문', '초급', '중급', '고급'] as const;

const DEFAULT_LECTURE: Omit<Lecture, 'id'> = {
  title: '',
  videoUrl: '',
  materialFile: null,
  isFree: false,
};

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function CourseRegisterForm({ categories }: CourseRegisterFormProps) {
  const router = useRouter();
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    level: '',
    thumbnailFile: null,
    lectures: [{ id: 1, ...DEFAULT_LECTURE }],
  });

  const subCategories = categories.find((c) => c.name === form.category)?.subCategories ?? [];

  // ── 기본정보 핸들러 ──────────────────────────────────────────
  const handleField = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value, subCategory: '' }));
  };

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleField('thumbnailFile', file);
  };

  // ── 커리큘럼 핸들러 ──────────────────────────────────────────
  const updateLecture = <K extends keyof Lecture>(id: number, key: K, value: Lecture[K]) => {
    setForm((prev) => ({
      ...prev,
      lectures: prev.lectures.map((l) => (l.id === id ? { ...l, [key]: value } : l)),
    }));
  };

  const addLecture = () => {
    setForm((prev) => ({
      ...prev,
      lectures: [...prev.lectures, { id: Date.now(), ...DEFAULT_LECTURE }],
    }));
  };

  const removeLecture = (id: number) => {
    if (form.lectures.length <= 1) return; // 최소 1개
    setForm((prev) => ({
      ...prev,
      lectures: prev.lectures.filter((l) => l.id !== id),
    }));
  };

  // ── 제출 ────────────────────────────────────────────────────
  const handleSubmit = (type: 'save' | 'submit') => {
    console.log(type, form);
    // TODO: API 연결
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
              className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none"
            />
          </div>

          {/* 카테고리 + 세부 카테고리 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>카테고리{requiredMark}</label>
              <Select value={form.category} onValueChange={handleCategoryChange}>
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
                disabled={!form.category}
              >
                <SelectTrigger className="h-11! text-[13.5px] border-[#D1D5DB] text-[#1E2125]">
                  <SelectValue placeholder="셀렉트박스" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {subCategories.map((sub) => (
                    <SelectItem key={sub} value={sub} className="text-[13px]">
                      {sub}
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
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>난이도{requiredMark}</label>
              <Select value={form.level} onValueChange={(v) => handleField('level', v)}>
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
              onChange={handleThumbnail}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => thumbnailRef.current?.click()}
              className="w-full h-12 rounded-lg border border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>↑</span>
              {form.thumbnailFile
                ? form.thumbnailFile.name
                : '강의 목록에 표시될 대표 이미지를 업로드하세요'}
            </button>
          </div>
        </section>

        {/* ── 커리큘럼 ── */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[16px] font-bold text-[#1E2125] pb-2 border-b border-[#E5E7EB]">
            커리큘럼
          </h2>

          {form.lectures.map((lecture, idx) => (
            <LectureItem
              key={lecture.id}
              lecture={lecture}
              index={idx}
              canRemove={form.lectures.length > 1}
              onUpdate={updateLecture}
              onRemove={removeLecture}
            />
          ))}

          {/* 회차 추가 버튼 */}
          <button
            type="button"
            onClick={addLecture}
            className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] text-[13px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="text-[16px]">+</span> 회차 추가
          </button>
        </section>

        {/* ── 버튼 ── */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            onClick={() => handleSubmit('save')}
            className="h-11 px-7 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
          >
            임시 저장
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => handleSubmit('submit')}
              className="h-11 px-7 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
            >
              승인 요청
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
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

// ── 회차 아이템 ──────────────────────────────────────────────────
interface LectureItemProps {
  lecture: Lecture;
  index: number;
  canRemove: boolean;
  onUpdate: <K extends keyof Lecture>(id: number, key: K, value: Lecture[K]) => void;
  onRemove: (id: number) => void;
}

function LectureItem({ lecture, index, canRemove, onUpdate, onRemove }: LectureItemProps) {
  const materialRef = useRef<HTMLInputElement>(null);

  const inputCls =
    'w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
      {/* 회차 헤더 */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-[#CFEE5D] text-[#1E2125] text-[12px] font-bold">
          회차 {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(lecture.id)}
            className="text-[#6A7282] hover:text-[#FF5E5E] text-[13px] transition-colors cursor-pointer"
          >
            삭제
          </button>
        )}
      </div>

      {/* 소제목 */}
      <div>
        <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
          소제목 <span className="text-[#FF5E5E]">*</span>
        </label>
        <input
          type="text"
          placeholder="강의 회차 제목을 입력하세요"
          value={lecture.title}
          onChange={(e) => onUpdate(lecture.id, 'title', e.target.value)}
          className={inputCls}
        />
      </div>

      {/* 영상 URL + 자료 업로드 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
            강의 영상 <span className="text-[#FF5E5E]">*</span>
          </label>
          <input
            type="url"
            placeholder="영상 URL을 입력하세요"
            value={lecture.videoUrl}
            onChange={(e) => onUpdate(lecture.id, 'videoUrl', e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[12.5px] font-semibold text-[#1E2125] mb-1.5">
            강의 자료 (선택)
          </label>
          <input
            type="file"
            ref={materialRef}
            onChange={(e) => onUpdate(lecture.id, 'materialFile', e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => materialRef.current?.click()}
            className="w-full h-11 rounded-lg border border-dashed border-[#D1D5DB] bg-white text-[12.5px] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125] transition-colors cursor-pointer flex items-center justify-center gap-1.5 px-3"
          >
            <span>↑</span>
            <span className="truncate">
              {lecture.materialFile ? lecture.materialFile.name : '자료 업로드'}
            </span>
          </button>
        </div>
      </div>

      {/* 무료 공개 체크박스 */}
      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={lecture.isFree}
          onChange={(e) => onUpdate(lecture.id, 'isFree', e.target.checked)}
          className="w-4 h-4 accent-[#CFEE5D] cursor-pointer"
        />
        <span className="text-[13px] text-[#1E2125]">무료 공개</span>
      </label>
    </div>
  );
}
