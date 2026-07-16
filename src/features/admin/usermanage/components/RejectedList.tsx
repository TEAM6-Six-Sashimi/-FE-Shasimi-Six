'use client';

import { useMemo, useState } from 'react';
import RejectDetailModal from '@/components/modals/RejectDetailModal';
import { RejectedInstructorApplication } from '../types';

const CATEGORY_LABEL_MAP: Record<string, string> = {
  INSUFFICIENT_CAREER_PROOF: '경력/이력 증빙 부족',
  INSUFFICIENT_BASIC_INFO: '기본 정보 미흡',
  UNABLE_TO_VERIFY_IDENTITY: '신원 확인 불가',
  INAPPROPRIATE_CAREER_INCLUDED: '부적절한 이력 포함',
};

const ITEMS_PER_PAGE = 10;

interface Props {
  rejected: RejectedInstructorApplication[];
}

export default function RejectedList({ rejected }: Props) {
  const [detailModal, setDetailModal] = useState<RejectedInstructorApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 최신순(반려일)
  const sorted = useMemo(
    () =>
      [...rejected].sort(
        (a, b) => new Date(b.rejectedAt).getTime() - new Date(a.rejectedAt).getTime(),
      ),
    [rejected],
  );

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
          {paged.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                반려된 강사 신청 이력이 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((r, idx) => (
              <tr
                key={r.applicationId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">{r.name}</td>
                <td className="py-3 text-center text-[#6A7282]">{r.loginId}</td>
                <td className="py-3 px-2 text-center text-[#6A7282] wrap-break-word">
                  {r.email.includes('@') ? (
                    <>
                      {r.email.slice(0, r.email.indexOf('@') + 1)}
                      <wbr />
                      {r.email.slice(r.email.indexOf('@') + 1)}
                    </>
                  ) : (
                    r.email
                  )}
                </td>
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
