'use client';

import type { RejectedCourse } from '../type';

interface Props {
  courses: RejectedCourse[];
}

export default function RejectedCourses({ courses }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">반려된 강의 목록</h2>
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">강사명</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">카테고리</th>
            <th className="py-3 w-[13%] text-center font-semibold text-[#1E2125]">반려일</th>
            <th className="py-3 w-[38%] text-center font-semibold text-[#1E2125]">반려 사유</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center text-[#6A7282]">
                반려된 강의가 없습니다.
              </td>
            </tr>
          ) : (
            courses.map((c) => (
              <tr
                key={c.courseId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="px-6 py-3 text-left font-semibold text-[#1E2125]">{c.title}</td>
                <td className="py-3 text-center text-[#6A7282]">{c.instructorName}</td>
                <td className="py-3 text-center text-[#6A7282]">{c.categoryName}</td>
                <td className="py-3 text-center text-[#6A7282]">
                  {c.updatedAt?.slice(0, 10) ?? '-'}
                </td>
                <td className="py-3 text-[#6A7282] text-left px-4">{c.rejectReason}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
