'use client';

import { useMemo, useState } from 'react';
import type { RejectedCourse } from '../type';
import type { Category } from '@/features/categories/types';
import RejectDetailModal from '@/components/modals/RejectDetailModal';
import Pagination from '@/components/ui/Pagination';

const ITEMS_PER_PAGE = 10;

interface Props {
  courses: RejectedCourse[];
  categories: Category[];
}

export default function RejectedCourses({ courses, categories }: Props) {
  const [detailModal, setDetailModal] = useState<RejectedCourse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  // 최신순(반려일)
  const sorted = useMemo(
    () =>
      [...courses].sort((a, b) => {
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }),
    [courses],
  );

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">반려된 강의 목록</h2>
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">강사명</th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125] break-keep">
              카테고리 &gt; 세부카테고리
            </th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">반려일</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">
              반려 사유 카테고리
            </th>
            <th className="py-3 w-[27%] text-center font-semibold text-[#1E2125]">
              반려 사유 내용
            </th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                반려된 강의가 없습니다.
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
                <td className="py-3 px-4 text-left font-semibold text-[#1E2125]">{c.title}</td>
                <td className="py-3 text-center text-[#6A7282]">{c.instructorName}</td>
                <td className="py-3 px-2 text-center text-[#6A7282] break-keep">
                  {getMainCategory(c.categoryName)} &gt; {c.categoryName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">
                  {c.updatedAt?.slice(0, 10) ?? '-'}
                </td>
                <td className="py-3 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-[#FFEBEB] text-[#FF5E5E]">
                    {c.rejectCategory.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-left">
                  <button
                    type="button"
                    onClick={() => setDetailModal(c)}
                    className="w-full text-left text-[#6A7282] truncate cursor-pointer hover:text-[#1E2125] hover:underline transition-colors"
                    title={c.rejectDetail}
                  >
                    {c.rejectDetail}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {detailModal && (
        <RejectDetailModal
          fields={[
            { label: '강의명', value: detailModal.title },
            { label: '강사명', value: detailModal.instructorName },
            { label: '반려일', value: detailModal.updatedAt?.slice(0, 10) ?? '-' },
          ]}
          category={detailModal.rejectCategory.label}
          detail={detailModal.rejectDetail}
          onClose={() => setDetailModal(null)}
        />
      )}
    </div>
  );
}
