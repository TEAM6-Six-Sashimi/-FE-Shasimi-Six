'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import type { PrivateCourse as PrivateCourseType } from '@/features/user/mycourses-instructor/types';
import type { Category } from '@/features/categories/types';

type SortOption = '최신순' | '인기순' | '평점순';

interface Props {
  categories?: Category[];
}

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
//   if (!thumbnail) return null;
//   return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
// }

// TODO: 실제 API 연결 전까지 사용하는 임시 데이터
const MOCK_PRIVATE_COURSES: PrivateCourseType[] = [
  {
    courseId: 101,
    categoryId: 1,
    title: 'React 완벽 가이드',
    thumbnail: '',
    price: 15900,
    ratingAvg: 4.8,
    studentCount: 1234,
    privatedAt: '2026-04-30',
  },
  {
    courseId: 102,
    categoryId: 1,
    title: 'TypeScript 마스터 클래스',
    thumbnail: '',
    price: 12900,
    ratingAvg: 4.8,
    studentCount: 1234,
    privatedAt: '2026-04-30',
  },
];

export default function PrivateCourse({ categories = [] }: Props) {
  // TODO: 실제 API 연결 시 props로 courses를 받아오도록 변경
  const courses = MOCK_PRIVATE_COURSES;

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('최신순');

  const getCategoryName = (categoryId: number) => {
    if (!categories || categories.length === 0) return String(categoryId);
    for (const cat of categories) {
      if (cat.mainCategoryId === categoryId) return cat.name;
      const option = cat.options?.find((o) => o.id === categoryId);
      if (option) return `${cat.name} > ${option.name}`;
    }
    return String(categoryId);
  };

  const filtered = (courses || [])
    .filter((c) => c.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === '인기순') return b.studentCount - a.studentCount;
      if (sort === '평점순') return b.ratingAvg - a.ratingAvg;
      return b.courseId - a.courseId; // 최신순
    });

  return (
    <div className="flex flex-col gap-6">
      {/* 검색 + 정렬 */}
      <div className="flex items-center gap-3">
        {/* 검색창 */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="강의 검색..."
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
        </div>

        {/* 정렬 드롭다운 */}
        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="h-11 w-28 text-[13.5px] border-[#D1D5DB] bg-[#F9FAFB] rounded-full cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {(['최신순', '인기순', '평점순'] as SortOption[]).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 강의 목록 */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#6A7282] text-[14px] bg-white rounded-xl border border-dashed border-[#D1D5DB]">
            {search ? '검색 결과가 없습니다.' : '비공개된 강의가 없습니다.'}
          </div>
        ) : (
          filtered.map((course) => {
            // const thumbnailUrl = getThumbnailUrl(course.thumbnail);
            return (
              <div
                key={course.courseId}
                className="bg-white rounded-xl border border-[#D1D5DB] px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                {/* 썸네일 */}
                {/* <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-[#E5E7EB] shrink-0">
                  {thumbnailUrl ? (
                    <Image
                      src={thumbnailUrl}
                      alt={course.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-[11px]">
                      No Image
                    </div>
                  )}
                </div> */}

                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14.5px] font-semibold text-[#1E2125]">{course.title}</p>
                    <span className="text-[11.5px] text-[#9CA3AF]">
                      비공개 처리일: {course.privatedAt}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6A7282]">{getCategoryName(course.categoryId)}</p>
                  <div className="flex items-center gap-2 text-[12px] text-[#6A7282]">
                    <span className="text-[#FFD700]">★</span>
                    <span>{course.ratingAvg?.toFixed(1) || '0.0'}</span>
                    <span className="w-px h-2 bg-[#D1D5DB]" />
                    <span>수강생 {course.studentCount?.toLocaleString() || 0}명</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[15px] font-bold text-[#1E2125]">
                    {course.price?.toLocaleString() || 0}{' '}
                    <span className="text-[13px] font-normal text-[#6A7282]">크레딧</span>
                  </span>
                  <Link href={`/mycourses-instructor/${course.courseId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 border-[#D1D5DB] text-[#1E2125] text-[12.5px] font-semibold hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      상세보기
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}