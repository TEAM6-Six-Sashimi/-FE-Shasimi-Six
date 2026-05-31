'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { AdminCourse } from '../type';

type SortOption = '최신순' | '인기순' | '높은 평점순';

interface Props {
  courses: AdminCourse[];
}

const ITEMS_PER_PAGE = 7;

export default function AllCourses({ courses }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('최신순');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categoryNames = ['전체', ...Array.from(new Set(courses.map((c) => c.categoryName)))];

  const filtered = useMemo(() => {
    let result = [...courses];
    if (search) result = result.filter((c) => c.title.includes(search));
    if (categoryFilter !== '전체')
      result = result.filter((c) => c.categoryName === categoryFilter);
    if (sort === '인기순') result.sort((a, b) => b.studentCount - a.studentCount);
    if (sort === '높은 평점순') result.sort((a, b) => b.ratingAvg - a.ratingAvg);
    if (sort === '최신순')
      result.sort(
        (a, b) =>
          new Date(b.approvedAt ?? 0).getTime() -
          new Date(a.approvedAt ?? 0).getTime(),
      );
    return result;
  }, [courses, search, sort, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="강의명 검색..."
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
        </div>
        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v as SortOption);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-32 text-[12.5px] border-[#D1D5DB] text-[#1E2125]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="bottom">
            {(['최신순', '인기순', '높은 평점순'] as SortOption[]).map((s) => (
              <SelectItem key={s} value={s} className="text-[12.5px]">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[28%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">강사명</th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">
              <div className="flex items-center text-center justify-center gap-1">
                카테고리
                <div className="relative">
                  <button
                    onClick={() => setCategoryOpen((v) => !v)}
                    className={`transition-colors cursor-pointer ${categoryFilter !== '전체' ? 'text-[#FF5E5E]' : 'text-[#6A7282] hover:text-[#1E2125]'}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 4h18v2.5l-7 7V20l-4-2v-6.5L3 6.5V4z" />
                    </svg>
                  </button>
                  {categoryOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 min-w-30">
                      {categoryNames.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategoryFilter(cat);
                            setCategoryOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`block w-full px-4 py-2 text-left text-[12.5px] hover:bg-[#F9FAFB] transition-colors ${
                            categoryFilter === cat
                              ? 'text-[#FF5E5E] font-semibold'
                              : 'text-[#1E2125]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">수강생 수</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">평점</th>
            <th className="py-3 w-[13%] text-center font-semibold text-[#1E2125]">등록일</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">상태</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((c) => (
              <tr
                key={c.courseId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="px-6 py-3 text-left">
                  <Link
                    href={`/courses/${encodeURIComponent(c.categoryName)}/${c.courseId}`}
                    className="font-semibold text-[#1E2125] hover:text-[#FF5E5E] hover:underline transition-colors"
                  >
                    {c.title}
                  </Link>
                </td>
                <td className="py-3 text-center text-[#6A7282]">{c.instructorName}</td>
                <td className="py-3 text-center text-[#6A7282]">{c.categoryName}</td>
                <td className="py-3 text-center text-[#6A7282]">
                  {c.studentCount.toLocaleString()}명
                </td>
                <td className="py-3 text-center">
                  <span className="text-[#FFD700]">★</span>
                  <span className="ml-1 font-semibold text-[#1E2125]">
                    {c.ratingAvg.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 text-center text-[#6A7282]">
                  {c.approvedAt?.slice(0, 10) ?? '-'}
                </td>
                <td className="py-3 text-center">
                  <span className="px-2 py-1 rounded text-[11px] font-semibold text-[#1E2125] bg-[#F1FFC1] border border-[#CFEE5D]">
                    공개
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
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
  );
}