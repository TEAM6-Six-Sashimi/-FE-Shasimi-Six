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
import Pagination from '@/components/ui/Pagination';
import SearchInput from '@/components/ui/SearchInput';
import { AdminCourse } from '../type';
import type { Category } from '@/features/categories/types';

type SortOption = '최신순' | '인기순' | '높은 평점순';

interface Props {
  courses: AdminCourse[];
  categories: Category[];
}

const ITEMS_PER_PAGE = 10;

export default function AllCourses({ courses, categories }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('최신순');
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 세부카테고리명 → 대카테고리명 매핑
  const subToMainMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat) => {
      cat.options.forEach((opt) => {
        map.set(opt.name, cat.name);
      });
    });
    return map;
  }, [categories]);

  const getMainCategory = (categoryName: string) => subToMainMap.get(categoryName) ?? categoryName;

  const categoryNames = [
    '전체',
    ...Array.from(new Set(courses.map((c) => getMainCategory(c.categoryName)))),
  ];

  const filtered = useMemo(() => {
    let result = [...courses];
    if (search)
      result = result.filter(
        (c) => c.title.includes(search) || c.instructorName.includes(search),
      );
    if (categoryFilter !== '전체')
      result = result.filter((c) => getMainCategory(c.categoryName) === categoryFilter);
    if (sort === '인기순') result.sort((a, b) => b.studentCount - a.studentCount);
    if (sort === '높은 평점순') result.sort((a, b) => b.ratingAvg - a.ratingAvg);
    if (sort === '최신순')
      result.sort(
        (a, b) => new Date(b.approvedAt ?? 0).getTime() - new Date(a.approvedAt ?? 0).getTime(),
      );
    return result;
  }, [courses, search, sort, categoryFilter, subToMainMap]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusBadge = (course: AdminCourse) => {
    const isPublic = course.status === 'APPROVED';
    return isPublic ? (
      <span className="px-2 py-1 rounded text-[11px] font-semibold text-[#827717] bg-[#F9FBE7] border border-[#827717]">
        공개
      </span>
    ) : (
      <span className="px-2 py-1 rounded text-[11px] font-semibold text-[#6A7282] bg-[#F3F4F6] border border-[#6A7282]">
        비공개
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <SearchInput
          onSearch={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          placeholder="강의명, 강사명 검색"
          className="flex-1 max-w-sm"
        />
        <Select
          value={sort}
          onValueChange={(v) => {
            setSort(v as SortOption);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="h-11! w-32 text-[13px] border-[#D1D5DB] bg-[#F9FAFB] text-[#1E2125] rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
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
            <th className="py-3 w-[5%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[28%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">강사명</th>
            <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125]">
              <div className="flex items-center text-center justify-center gap-1 break-keep">
                카테고리 &gt; 세부카테고리
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
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 min-w-50">
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
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">평점</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">등록일</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">상태</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center text-[#6A7282]">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((c, idx) => (
              <tr
                key={c.courseId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="px-4 py-3 text-left">
                  <Link
                    href={`/admin/coursemanage/${c.courseId}?from=all`}
                    className="font-semibold text-[#1E2125] hover:text-[#FF5E5E] hover:underline transition-colors"
                  >
                    {c.title}
                  </Link>
                </td>
                <td className="py-3 text-center text-[#6A7282]">{c.instructorName}</td>
                <td className="py-3 px-2 text-center text-[#6A7282] break-keep">
                  {getMainCategory(c.categoryName)} &gt; {c.categoryName}
                </td>
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
                <td className="py-3 text-center">{getStatusBadge(c)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
