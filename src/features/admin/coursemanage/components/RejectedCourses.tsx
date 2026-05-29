'use client';

import { RejectedCourse } from "../type";


const MOCK_REJECTED: RejectedCourse[] = [
  { id: 1, title: 'HTML 기초 강의', instructorName: '강강사', category: 'AI·데이터', rejectedAt: '2026-05-08', rejectReason: '강의 내용이 기준 미달입니다. 커리큘럼을 보완해주세요.' },
  { id: 2, title: 'CSS 스타일링 완벽 가이드', instructorName: '송강사', category: '라이프·교육', rejectedAt: '2026-05-05', rejectReason: '강의 영상 품질이 낮습니다. 재촬영 후 재신청 바랍니다.' },
  { id: 3, title: 'JavaScript 입문', instructorName: '한강사', category: 'AI·데이터', rejectedAt: '2026-05-03', rejectReason: '유사 강의가 이미 등록되어 있습니다.' },
];

export default function RejectedCourses() {
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
          {MOCK_REJECTED.map((c) => (
            <tr key={c.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
              <td className="py-3 text-center font-semibold text-[#1E2125]">{c.title}</td>
              <td className="py-3 text-center text-[#6A7282]">{c.instructorName}</td>
              <td className="py-3 text-center text-[#6A7282]">{c.category}</td>
              <td className="py-3 text-center text-[#6A7282]">{c.rejectedAt}</td>
              <td className="py-3 text-[#6A7282] text-left px-4">{c.rejectReason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}