'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CourseCard from '@/features/user/courses/components/CourseCard';
import FilterDropdown, {
  type FilterValues,
} from '@/features/user/courses/components/FilterDropdown';
import Image from 'next/image';
import { Category } from '@/features/categories/types';
import { CourseFromAPI } from '@/features/user/courses/types';

const ITEMS_PER_PAGE = 16;

type SortType = '인기순' | '최신순' | '높은 평점순';

interface CourseListPageProps {
  categories: Category[];
  initialCourses: CourseFromAPI[];
}

export default function CourseListPage({ categories, initialCourses }: CourseListPageProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = decodeURIComponent(params.category as string);
  const sub = searchParams.get('sub') ? decodeURIComponent(searchParams.get('sub')!) : null;

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('인기순');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    level: '전체',
    priceRange: [0, 100000],
    durationRange: [0, 100],
    ratingRange: [0, 5],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);

  // 현재 카테고리의 서브카테고리 목록
  const currentCategory = categories.find((c) => c.name === category);
  const subCategories = currentCategory ? ['전체', ...currentCategory.subCategories] : ['전체'];

  // 필터 외부 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 페이지 변경 시 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [category, sub, search, filters, sort]);

  // 필터링 + 정렬 (프론트에서 처리, 추후 백엔드 페이지네이션으로 교체 예정)
  const filteredCourses = useMemo(() => {
    let result = [...initialCourses];

    if (search)
      result = result.filter((c) => c.title.includes(search) || c.instructorName.includes(search));

    result = result.filter(
      (c) =>
        c.price >= filters.priceRange[0] &&
        c.price <= filters.priceRange[1] &&
        c.totalDuration >= filters.durationRange[0] &&
        c.totalDuration <= filters.durationRange[1] &&
        c.ratingAvg >= filters.ratingRange[0] &&
        c.ratingAvg <= filters.ratingRange[1],
    );

    if (sort === '인기순') result = result.sort((a, b) => b.studentCount - a.studentCount);
    if (sort === '최신순') result = result; // TODO: 백엔드에서 createdAt 필드 추가 후 정렬
    if (sort === '높은 평점순') result = result.sort((a, b) => b.ratingAvg - a.ratingAvg);

    return result;
  }, [initialCourses, search, filters, sort]);

  // 페이지네이션 (추후 백엔드 페이지네이션으로 교체 예정)
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const pagedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* 카테고리 타이틀 */}
          <h1 className="text-[#1E2125] text-3xl font-bold">{category}</h1>

          {/* 검색 + 상세검색 */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
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

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((prev) => !prev)}
                className={`flex items-center gap-2 h-11 px-5 rounded-full border-2 text-[13.5px] font-semibold transition-colors cursor-pointer ${
                  filterOpen
                    ? 'border-[#1E2125] bg-[#D1D5DB] text-[#1E2125]'
                    : 'border-[#D1D5DB] bg-white text-[#1E2125] hover:bg-[#F9FAFB]'
                }`}
              >
                <Image src="/search/searchdetail-Icon.svg" alt="" width={17} height={17} />
                상세검색
              </button>
              <FilterDropdown
                open={filterOpen}
                onApply={(f) => {
                  setFilters(f);
                  setFilterOpen(false);
                }}
                onReset={() =>
                  setFilters({
                    level: '전체',
                    priceRange: [0, 100000],
                    durationRange: [0, 100],
                    ratingRange: [0, 5],
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* 서브카테고리 탭 + 정렬 */}
        <div className="flex items-center justify-between mb-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-0 overflow-x-auto">
            {subCategories.map((item) => {
              const isActive = sub ? sub === item : item === '전체';
              const href =
                item === '전체'
                  ? `/courses/${encodeURIComponent(category)}`
                  : `/courses/${encodeURIComponent(category)}?sub=${encodeURIComponent(item)}`;
              return (
                <Link
                  key={item}
                  href={href}
                  className={`px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
                    isActive
                      ? 'border-[#FF5F5F] text-[#FF5F5F] font-semibold'
                      : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>

          <div className="shrink-0 ml-4 mb-1">
            <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
              <SelectTrigger className="h-8 w-32 text-[12.5px] border-[#D1D5DB] text-[#1E2125]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['인기순', '최신순', '높은 평점순'] as SortType[]).map((s) => (
                  <SelectItem key={s} value={s} className="text-[12.5px]">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 강의 그리드 */}
        {pagedCourses.length > 0 ? (
          <div className="grid grid-cols-4 gap-5 mb-10">
            {pagedCourses.map((course, idx) => (
              <CourseCard key={idx} course={course} category={category} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 text-[#6A7282] text-[14px]">
            검색 결과가 없습니다.
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#1E2125] text-white'
                    : 'text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
