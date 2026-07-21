'use client';

import { useMemo, useState } from 'react';
import type { AdminPendingCourse } from '../type';
import type { Category } from '@/features/categories/types';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

interface Props {
  courses: AdminPendingCourse[];
  setCourses: React.Dispatch<React.SetStateAction<AdminPendingCourse[]>>;
  categories: Category[];
}

export default function PendingCourses({ courses, categories }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const sorted = [...courses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  const router = useRouter();

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">강의 승인 대기 목록</h2>
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[25%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">강사명</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">강사 ID</th>
            <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125] break-keep">
              카테고리 &gt; 세부카테고리
            </th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">승인 요청일</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-[#6A7282]">
                승인 대기 중인 강의가 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((c, idx) => (
              <tr
                key={c.courseId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/coursemanage/${c.courseId}?from=pending`)}
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="py-3 px-4 text-left font-semibold text-[#1E2125]">{c.title}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">
                  {c.instructorName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">{c.instructorLoginId}</td>
                <td className="py-3 px-2 text-center text-[#6A7282] break-keep">
                  {getMainCategory(c.categoryName)} &gt; {c.categoryName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">{c.createdAt.slice(0, 10)}</td>
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
