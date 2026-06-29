'use client';

import { useMemo, useState } from 'react';
import type { RejectedCourse } from '../type';
import type { Category } from '@/features/categories/types';
import RejectDetailModal from '@/components/modals/RejectDetailModal';
import type { CourseRejectReasonDetail } from '../type';
import { fetchCourseRejectReasonDetailAction } from '../action';

interface Props {
  courses: RejectedCourse[];
  categories: Category[];
}

export default function RejectedCourses({ courses, categories }: Props) {
  const [detailModal, setDetailModal] = useState<CourseRejectReasonDetail | null>(null);
  const [loadingCourseId, setLoadingCourseId] = useState<number | null>(null);

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

  const handleOpenDetail = async (courseId: number) => {
    setLoadingCourseId(courseId);
    try {
      const detail = await fetchCourseRejectReasonDetailAction(courseId);
      if (detail) setDetailModal(detail);
    } finally {
      setLoadingCourseId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">반려된 강의 목록</h2>
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">강사명</th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">
              카테고리 &gt; 세부카테고리
            </th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">반려일</th>
            <th className="py-3 w-[25%] text-center font-semibold text-[#1E2125]">
              반려 사유 (카테고리: 사유 상세)
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-[#6A7282]">
                반려된 강의가 없습니다.
              </td>
            </tr>
          ) : (
            courses.map((c, idx) => (
              <tr
                key={c.courseId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{idx + 1}</td>
                <td className="py-3 px-4 text-left font-semibold text-[#1E2125]">{c.title}</td>
                <td className="py-3 text-center text-[#6A7282]">{c.instructorName}</td>
                <td className="py-3 text-center text-[#6A7282]">
                  {getMainCategory(c.categoryName)} &gt; {c.categoryName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">
                  {c.updatedAt?.slice(0, 10) ?? '-'}
                </td>
                <td
                  onClick={() => handleOpenDetail(c.courseId)}
                  className="py-3 text-[#6A7282] text-left px-4 truncate cursor-pointer hover:text-[#1E2125] hover:underline transition-colors"
                  title={c.rejectReason}
                >
                  {loadingCourseId === c.courseId ? '불러오는 중...' : c.rejectReason}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {detailModal && (
        <RejectDetailModal
          fields={[
            { label: '강의명', value: detailModal.title },
            { label: '반려일', value: detailModal.rejectedAt.slice(0, 10) },
          ]}
          category={detailModal.category.label}
          detail={detailModal.detail}
          onClose={() => setDetailModal(null)}
        />
      )}
    </div>
  );
}