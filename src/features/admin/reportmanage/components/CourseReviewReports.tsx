'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ReviewReport, REPORT_CATEGORY_LABEL, REPORT_CATEGORY_STYLE } from '../types';
import ReviewReportDetailModal from './ReviewReportDetailModal';

type FilterType = '전체' | '처리전' | '처리됨';

interface Props {
  reports: ReviewReport[];
  setReports: React.Dispatch<React.SetStateAction<ReviewReport[]>>;
}

const STATUS_STYLE: Record<ReviewReport['status'], string> = {
  PENDING: 'bg-[#FFEBEB] text-[#FF5E5E]',
  PROCESSED: 'bg-[#F1FFC1] text-[#5C7A00]',
};

const STATUS_LABEL: Record<ReviewReport['status'], string> = {
  PENDING: '처리전',
  PROCESSED: '처리됨',
};

const ITEMS_PER_PAGE = 10;

export default function CourseReviewReports({ reports, setReports }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('전체');
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...reports];

    if (search) {
      result = result.filter(
        (r) => r.writerLoginId.includes(search) || r.courseName.includes(search),
      );
    }

    if (filter === '처리전') result = result.filter((r) => r.status === 'PENDING');
    if (filter === '처리됨') result = result.filter((r) => r.status === 'PROCESSED');

    return result.sort(
      (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime(),
    );
  }, [reports, search, filter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // 삭제/반려 처리 후 해당 신고를 PROCESSED로 갱신 (서버 재조회 없이 즉시 반영)
  const handleProcessed = (reportId: number) => {
    setReports((prev) =>
      prev.map((r) => (r.reportId === reportId ? { ...r, status: 'PROCESSED' } : r)),
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">신고된 수강평 목록</h2>

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          {(['전체', '처리전', '처리됨'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-[#1E2125] text-white'
                  : 'bg-white text-[#6A7282] border border-[#D1D5DB] hover:bg-[#F9FAFB]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="작성자 ID, 강의명 검색"
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
        </div>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[5%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[26%] text-center font-semibold text-[#1E2125]">리뷰 내용</th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">강의명</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">작성자 ID</th>
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">신고 카테고리</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">신고일</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">상태</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                해당하는 신고가 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((r, idx) => (
              <tr
                key={r.reportId}
                onClick={() => setSelectedReportId(r.reportId)}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="py-3 px-4 text-left text-[#1E2125] truncate" title={r.reviewContent}>
                  {r.reviewContent}
                </td>
                <td className="py-3 text-center text-[#6A7282]">{r.courseName}</td>
                <td className="py-3 text-center text-[#6A7282]">{r.writerLoginId}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${REPORT_CATEGORY_STYLE[r.category]}`}
                  >
                    {REPORT_CATEGORY_LABEL[r.category]}
                  </span>
                </td>
                <td className="py-3 text-center text-[#6A7282]">{r.reportedAt.slice(0, 10)}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-[11.5px] font-semibold ${STATUS_STYLE[r.status]}`}
                  >
                    {STATUS_LABEL[r.status]}
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

      {selectedReportId !== null && (
        <ReviewReportDetailModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
          onProcessed={handleProcessed}
        />
      )}
    </div>
  );
}
