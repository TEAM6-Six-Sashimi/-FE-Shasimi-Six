'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseDetailFromAPI, CourseFromAPI, DIFFICULTY_LABEL } from '../../courses/types';
import { Category } from '@/features/categories/types';
import {
  fetchCategoriesAction,
  fetchCourseDetailAction,
  fetchCoursesBySubCategoryAction,
} from '../actions';
import { getThumbnailUrl, isLocalhostUrl } from '@/lib/thumbnail';

// function formatDuration(seconds: number): string {
//   const hours = Math.floor(seconds / 3600);
//   return `${hours}시간`;
// }

// 비교 슬롯(좌/우) 한 칸의 상태
interface CompareSlot {
  courseId: number | null;
  detail: CourseDetailFromAPI | null;
  isLoading: boolean;
}

const EMPTY_SLOT: CompareSlot = { courseId: null, detail: null, isLoading: false };

export default function ComapareForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainCategoryId, setMainCategoryId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [courseOptions, setCourseOptions] = useState<CourseFromAPI[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const [slotA, setSlotA] = useState<CompareSlot>(EMPTY_SLOT);
  const [slotB, setSlotB] = useState<CompareSlot>(EMPTY_SLOT);

  // 카테고리 목록 로드
  useEffect(() => {
    fetchCategoriesAction().then(setCategories);
  }, []);

  const selectedMainCategory = categories.find(
    (cat) => String(cat.mainCategoryId) === mainCategoryId,
  );
  const subCategoryOptions = selectedMainCategory?.options ?? [];

  // 대분류 변경 시 - 소분류/강의/비교슬롯 전부 초기화
  const handleMainCategoryChange = (value: string) => {
    setMainCategoryId(value);
    setSubCategoryId('');
    setCourseOptions([]);
    setSlotA(EMPTY_SLOT);
    setSlotB(EMPTY_SLOT);
  };

  // 소분류(자격증) 변경 시 - 그 안의 강의 목록 조회, 비교슬롯 초기화
  const handleSubCategoryChange = async (value: string) => {
    setSubCategoryId(value);
    setSlotA(EMPTY_SLOT);
    setSlotB(EMPTY_SLOT);

    if (!selectedMainCategory) return;

    setIsLoadingCourses(true);
    try {
      const courses = await fetchCoursesBySubCategoryAction(selectedMainCategory.name, value);
      setCourseOptions(courses);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // 비교 강의 선택 시 - 상세 정보 조회
  const handleCourseSelect = async (slot: 'A' | 'B', courseId: string) => {
    const id = Number(courseId);
    const setSlot = slot === 'A' ? setSlotA : setSlotB;

    setSlot({ courseId: id, detail: null, isLoading: true });

    const detail = await fetchCourseDetailAction(courseId);
    setSlot({ courseId: id, detail, isLoading: false });
  };

  const selectCls = 'w-full h-11 text-[13.5px] border-[#D1D5DB] bg-[#F9FAFB] rounded-lg';

  return (
    <div className="flex flex-col gap-6">
      {/* ===================== 선택 영역 ===================== */}
      <div className="bg-white rounded-xl shadow-md p-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1E2125]">대분류</label>
            <Select value={mainCategoryId} onValueChange={handleMainCategoryChange}>
              <SelectTrigger className={`${selectCls} w-48`}>
                <SelectValue placeholder="대분류 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.mainCategoryId} value={String(cat.mainCategoryId)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-[#9CA3AF] mt-6">{'>'}</span>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1E2125]">자격증</label>
            <Select
              value={subCategoryId}
              onValueChange={handleSubCategoryChange}
              disabled={!mainCategoryId}
            >
              <SelectTrigger className={`${selectCls} w-48`}>
                <SelectValue placeholder="자격증 선택" />
              </SelectTrigger>
              <SelectContent>
                {subCategoryOptions.map((opt) => (
                  <SelectItem key={opt.id} value={String(opt.id)}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold text-[#1E2125]">비교 강의 선택</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { slot: slotA, key: 'A' as const },
              { slot: slotB, key: 'B' as const },
            ].map(({ slot, key }) => (
              <div key={key} className="flex flex-col gap-3">
                <Select
                  value={slot.courseId ? String(slot.courseId) : ''}
                  onValueChange={(value) => handleCourseSelect(key, value)}
                  disabled={!subCategoryId || isLoadingCourses}
                >
                  <SelectTrigger className={selectCls}>
                    <SelectValue placeholder="강의를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map((course) => (
                      <SelectItem key={course.courseId} value={String(course.courseId)}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 선택된 강의 썸네일 + 상세보기 링크 */}
                <div className="overflow-hidden min-h-44 flex items-center justify-center">
                  {slot.isLoading ? (
                    <p className="text-[13px] text-[#9CA3AF]">불러오는 중...</p>
                  ) : slot.detail ? (
                    <div className="w-full">
                      <div className="relative w-full h-50">
                        {getThumbnailUrl(slot.detail.thumbnail) && (
                          <Image
                            src={getThumbnailUrl(slot.detail.thumbnail)!}
                            alt={slot.detail.title}
                            fill
                            unoptimized={isLocalhostUrl(slot.detail.thumbnail ?? '')}
                            className="object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <div className="p-2">
                        <Link
                          href={`/courses/${encodeURIComponent(slot.detail.categoryName)}/${slot.detail.courseId}`}
                          className="text-[13px] font-semibold text-[#FF5E5E] hover:underline"
                        >
                          강의 상세 보기 &gt;
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#9CA3AF]">강의를 선택하세요</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== 비교 표 ===================== */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <CompareRow label="기본 정보" isSection />
        <CompareRow
          label="난이도"
          valueA={slotA.detail ? DIFFICULTY_LABEL[slotA.detail.difficulty] : null}
          valueB={slotB.detail ? DIFFICULTY_LABEL[slotB.detail.difficulty] : null}
          badge
        />
        {/* <CompareRow
          label="학습 시간"
          valueA={slotA.detail ? formatDuration(slotA.detail.totalDuration) : null}
          valueB={slotB.detail ? formatDuration(slotB.detail.totalDuration) : null}
        /> */}
        <CompareRow
          label="강의 수"
          valueA={slotA.detail ? `${slotA.detail.sessions.length}강` : null}
          valueB={slotB.detail ? `${slotB.detail.sessions.length}강` : null}
        />
        <CompareRow
          label="가격"
          valueA={slotA.detail ? `${slotA.detail.price.toLocaleString()} 크레딧` : null}
          valueB={slotB.detail ? `${slotB.detail.price.toLocaleString()} 크레딧` : null}
          highlight
        />

        <CompareRow label="수강 현황" isSection />
        <CompareRow
          label="평점"
          valueA={slotA.detail ? `⭐ ${slotA.detail.ratingAvg.toFixed(1)} / 5.0` : null}
          valueB={slotB.detail ? `⭐ ${slotB.detail.ratingAvg.toFixed(1)} / 5.0` : null}
        />
        <CompareRow
          label="수강생"
          valueA={slotA.detail ? `${slotA.detail.studentCount.toLocaleString()}명` : null}
          valueB={slotB.detail ? `${slotB.detail.studentCount.toLocaleString()}명` : null}
        />

        <CompareRow label="강사 정보" isSection />
        <CompareRow
          label="강사명"
          valueA={slotA.detail?.instructor.name ?? null}
          valueB={slotB.detail?.instructor.name ?? null}
        />
        <CompareCareerRow label="주요 경력" detailA={slotA.detail} detailB={slotB.detail} />

        <CompareRow label="커리큘럼" isSection />
        <CompareSessionRow label="전체 세션" detailA={slotA.detail} detailB={slotB.detail} />
      </div>
    </div>
  );
}

// 일반 비교 행 (라벨 / 좌측 값 / 우측 값)
function CompareRow({
  label,
  valueA,
  valueB,
  isSection = false,
  badge = false,
  highlight = false,
}: {
  label: string;
  valueA?: string | null;
  valueB?: string | null;
  isSection?: boolean;
  badge?: boolean;
  highlight?: boolean;
}) {
  if (isSection) {
    return (
      <div className="pt-10 pb-2 first:pt-0">
        <h3 className="text-[15px] font-bold text-[#1E2125]">{label}</h3>
        <hr className="border-[#E5E7EB] mt-2" />
      </div>
    );
  }

  const renderValue = (value: string | null | undefined) => {
    if (!value) return <span className="text-[#D1D5DB]">—</span>;
    if (badge) {
      return (
        <span className="inline-block px-2.5 py-1 rounded-full bg-[#F9FBE7] text-[#827717] text-[12.5px] font-semibold">
          {value}
        </span>
      );
    }
    return (
      <span className={`text-[14px] ${highlight ? 'font-bold text-[#FF5E5E]' : 'text-[#1E2125]'}`}>
        {value}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-[100px_1fr_1fr] items-center py-3 border-b border-[#F3F4F6]">
      <span className="text-[13px] text-[#6A7282]">{label}</span>
      <div>{renderValue(valueA)}</div>
      <div>{renderValue(valueB)}</div>
    </div>
  );
}

// 주요 경력 목록 - bullet list 형태로 표시
function CompareCareerRow({
  label,
  detailA,
  detailB,
}: {
  label: string;
  detailA: CourseDetailFromAPI | null;
  detailB: CourseDetailFromAPI | null;
}) {
  const renderCareers = (detail: CourseDetailFromAPI | null) => {
    const careers = detail?.instructor.mainCareers ?? [];
    if (careers.length === 0) return <span className="text-[#D1D5DB]">—</span>;
    return (
      <ul className="flex flex-col gap-1">
        {careers.map((career, idx) => (
          <li key={idx} className="text-[13.5px] text-[#1E2125] flex items-start gap-1.5">
            <span className="text-[#6A7282] mt-0.5">•</span>
            {career}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="grid grid-cols-[100px_1fr_1fr] items-start py-3 border-b border-[#F3F4F6]">
      <span className="text-[13px] text-[#6A7282]">{label}</span>
      <div>{renderCareers(detailA)}</div>
      <div>{renderCareers(detailB)}</div>
    </div>
  );
}

// 커리큘럼 섹션 목록은 줄바꿈이 많아서 별도 행으로 처리
function CompareSessionRow({
  label,
  detailA,
  detailB,
}: {
  label: string;
  detailA: CourseDetailFromAPI | null;
  detailB: CourseDetailFromAPI | null;
}) {
  const renderSessions = (detail: CourseDetailFromAPI | null) => {
    if (!detail) return <span className="text-[#D1D5DB]">—</span>;
    const sorted = [...detail.sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[12px] text-[#9CA3AF]">총 {sorted.length}개 세션</span>
        {sorted.map((s) => (
          <span key={s.sessionId} className="text-[12.5px] text-[#1E2125]">
            {s.title}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[100px_1fr_1fr] items-start py-3 border-b border-[#F3F4F6]">
      <span className="text-[13px] text-[#6A7282]">{label}</span>
      <div>{renderSessions(detailA)}</div>
      <div>{renderSessions(detailB)}</div>
    </div>
  );
}
