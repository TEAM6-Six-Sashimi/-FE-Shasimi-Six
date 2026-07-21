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
  courses: PrivateCourseType[];
  categories?: Category[];
}

const ITEMS_PER_PAGE = 5;

export default function PrivateCourse({ courses = [], categories = [] }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('최신순');
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      {/* 검색 + 정렬 */}
      <div className="flex items-center gap-3">
        {/* 검색창 */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="강의 검색..."
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
        </div>

        {/* 정렬 드롭다운 */}
        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v as SortOption);
            setPage(1);
          }}
        >
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
          paged.map((course) => {
            return (
              <div
                key={course.courseId}
                className="bg-white rounded-xl border border-[#D1D5DB] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14.5px] font-semibold text-[#1E2125]">{course.title}</p>
                  </div>
                  <p className="text-[12px] text-[#6A7282]">{getCategoryName(course.categoryId)}</p>
                  <div className="flex items-center gap-2 text-[12px] text-[#6A7282]">
                    <span className="text-[#FFD700]">★</span>
                    <span>{course.ratingAvg?.toFixed(1) || '0.0'}</span>
                    <span className="w-px h-2 bg-[#D1D5DB]" />
                    <span>수강생 {course.studentCount?.toLocaleString() || 0}명</span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                page === p
                  ? 'bg-[#1E2125] text-white'
                  : 'text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
