'use client';

import { useState } from 'react';
import RejectDetailModal from '@/components/modals/RejectDetailModal';
import { RejectedInstructorApplication } from '../types';

const CATEGORY_LABEL_MAP: Record<string, string> = {
  INSUFFICIENT_CAREER_PROOF: '경력/이력 증빙 부족',
  INSUFFICIENT_BASIC_INFO: '기본 정보 미흡',
  UNABLE_TO_VERIFY_IDENTITY: '신원 확인 불가',
  INAPPROPRIATE_CAREER_INCLUDED: '부적절한 이력 포함',
};

interface Props {
  rejected: RejectedInstructorApplication[];
}

export default function RejectedList({ rejected }: Props) {
  const [detailModal, setDetailModal] = useState<RejectedInstructorApplication | null>(null);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">강사 신청 반려 이력</h2>
      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[5%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">이름</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">이메일</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">반려일</th>
            <th className="py-3 w-[17%] text-center font-semibold text-[#1E2125]">
              반려 사유 카테고리
            </th>
            <th className="py-3 w-[30%] text-center font-semibold text-[#1E2125]">
              반려 사유 내용
            </th>
          </tr>
        </thead>
        <tbody>
          {rejected.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                반려된 강사 신청 이력이 없습니다.
              </td>
            </tr>
          ) : (
            rejected.map((r, idx) => (
              <tr
                key={r.applicationId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{idx + 1}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">{r.name}</td>
                <td className="py-3 text-center text-[#6A7282]">{r.loginId}</td>
                <td className="py-3 text-center text-[#6A7282]">{r.email}</td>
                <td className="py-3 text-center text-[#6A7282]">{r.rejectedAt.slice(0, 10)}</td>
                <td className="py-3 text-center">
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-[#FFEBEB] text-[#FF5E5E]">
                    {CATEGORY_LABEL_MAP[r.rejectionCategory] ?? r.rejectionCategory}
                  </span>
                </td>
                <td
                  onClick={() => setDetailModal(r)}
                  className="py-3 px-4 text-left text-[#6A7282] truncate cursor-pointer hover:text-[#1E2125] hover:underline transition-colors"
                  title={r.rejectionReason}
                >
                  {r.rejectionReason}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 반려 사유 상세 모달 (공용) */}
      {detailModal && (
        <RejectDetailModal
          fields={[
            { label: '이름', value: detailModal.name },
            { label: '반려일', value: detailModal.rejectedAt.slice(0, 10) },
          ]}
          category={
            CATEGORY_LABEL_MAP[detailModal.rejectionCategory] ?? detailModal.rejectionCategory
          }
          detail={detailModal.rejectionReason}
          onClose={() => setDetailModal(null)}
        />
      )}
    </div>
  );
}
