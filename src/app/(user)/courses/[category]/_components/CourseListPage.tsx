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

type SortType = '인기순' | '최신순' | '평점순';

interface CourseListPageProps {
  categories: Category[];
  initialCourses: CourseFromAPI[];
}

export default function CourseListPage({ categories, initialCourses }: CourseListPageProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = decodeURIComponent(params.category as string);
  const sub = searchParams.get('sub') ? decodeURIComponent(searchParams.get('sub')!) : null;
  const subCategoryId = sub ? Number(sub) : null;

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('인기순');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    priceRange: [0, 100000000],
    ratingRange: [0, 5],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef<HTMLDivElement>(null);

  const currentCategory = categories.find((c) => c.name === category);
  const subCategories = currentCategory
    ? [{ id: 0, name: '전체' }, ...currentCategory.options]
    : [{ id: 0, name: '전체' }];

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

  // 필터/정렬/검색 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [category, sub, search, filters, sort]);

  const filteredCourses = useMemo(() => {
    let result = [...initialCourses];

    if (search)
      result = result.filter((c) => c.title.includes(search) || c.instructorName.includes(search));

    result = result.filter(
      (c) =>
        c.price >= filters.priceRange[0] &&
        c.price <= filters.priceRange[1] &&
        c.ratingAvg >= filters.ratingRange[0] &&
        c.ratingAvg <= filters.ratingRange[1],
    );

    if (sort === '인기순') result = result.sort((a, b) => b.studentCount - a.studentCount);
    if (sort === '평점순') result = result.sort((a, b) => b.ratingAvg - a.ratingAvg);
    // 최신순은 서버에서 이미 정렬된 순서 유지

    return result;
  }, [initialCourses, search, filters, sort]);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const pagedCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* 헤더: 카테고리 타이틀 + 검색 */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-[#1E2125] text-3xl font-bold">{category}</h1>

          <div className="flex items-center gap-3">
            {/* 검색 */}
            <div className="relative flex-1 max-w-xl">
              <label htmlFor="course-search" className="sr-only">
                강의 검색
              </label>
              <input
                id="course-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="강의 검색..."
                className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
              />
              <span
                aria-hidden="true"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]"
              >
                <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
              </span>
            </div>

            {/* 상세검색 필터 */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                aria-expanded={filterOpen}
                aria-controls="filter-dropdown"
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
              <div id="filter-dropdown">
                <FilterDropdown
                  open={filterOpen}
                  onApply={(f) => {
                    setFilters(f);
                    setFilterOpen(false);
                  }}
                  onReset={() =>
                    setFilters({
                      priceRange: [0, 100000000],
                      ratingRange: [0, 5],
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* 서브카테고리 탭 + 정렬 */}
        <div className="flex items-center justify-between mb-6 border-b border-[#E5E7EB]">
          <nav aria-label="세부 카테고리">
            <ul className="flex items-center gap-0 overflow-x-auto list-none">
              {subCategories.map((item) => {
                const isActive = subCategoryId ? subCategoryId === item.id : item.id === 0;
                const href =
                  item.id === 0
                    ? `/courses/${encodeURIComponent(category)}`
                    : `/courses/${encodeURIComponent(category)}?sub=${item.id}`;
                return (
                  <li key={item.id}>
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`block px-4 py-2.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
                        isActive
                          ? 'border-[#FF5F5F] text-[#FF5F5F] font-semibold'
                          : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 ml-4 mb-1">
            <label htmlFor="sort-select" className="sr-only">
              정렬 기준
            </label>
            <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
              <SelectTrigger
                id="sort-select"
                className="h-8 w-32 text-[12.5px] border-[#D1D5DB] text-[#1E2125]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom">
                {(['인기순', '최신순', '평점순'] as SortType[]).map((s) => (
                  <SelectItem key={s} value={s} className="text-[12.5px]">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 강의 목록 */}
        {pagedCourses.length > 0 ? (
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10 list-none">
            {pagedCourses.map((course, idx) => (
              <li key={course.courseId}>
                {/* 첫 4개(1행)는 priority로 LCP 개선 */}
                <CourseCard course={course} category={category} priority={idx < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex items-center justify-center h-60 text-[#6A7282] text-[14px]">
            검색 결과가 없습니다.
          </p>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav aria-label="페이지 이동">
            <ul className="flex items-center justify-center gap-1 list-none">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="이전 페이지"
                  className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
                >
                  이전
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`${page}페이지`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#FF5E5E] text-white'
                        : 'text-[#1E2125] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="다음 페이지"
                  className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
                >
                  다음
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
