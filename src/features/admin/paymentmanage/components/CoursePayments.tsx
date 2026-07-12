'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchCoursePaymentsAction } from '../actions';
import { AdminCoursePayment } from '../types';

export default function CoursePayments() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminCoursePayment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // 검색어는 디바운스 처리 - 타이핑 중 매번 서버 조회하지 않도록
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword.trim()), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // 검색/기간 조건이 바뀌면 첫 페이지로
  useEffect(() => {
    setPage(0);
  }, [startDate, endDate, debouncedKeyword]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchCoursePaymentsAction({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      keyword: debouncedKeyword || undefined,
      page,
      size: 10,
    })
      .then((result) => {
        if (!active) return;
        setItems(result.items);
        setTotalPages(result.totalPages);
        setAuthError(!!result.authError);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
        setTotalPages(0);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [startDate, endDate, debouncedKeyword, page]);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">전체 강의 결제 내역</h2>

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-11 px-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13px] text-[#1E2125] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="text-[#6A7282] text-[13px]">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-11 px-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13px] text-[#1E2125] outline-none focus:border-[#1E2125] transition-colors"
          />
        </div>

        <div className="relative w-72">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="회원명, 회원 ID, 주문번호 검색"
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
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">주문번호</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">회원명</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[32%] text-center font-semibold text-[#1E2125]">결제 목록</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">총 결제 금액</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">결제일</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                불러오는 중...
              </td>
            </tr>
          ) : authError ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#FF5E5E]">
                로그인이 필요합니다. 다시 로그인해주세요.
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                결제 내역이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((payment) => (
              <tr
                key={payment.orderNo}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{payment.rowNumber}</td>
                <td className="py-3 text-center text-[#6A7282]">{payment.orderNo}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">
                  {payment.userName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">{payment.loginId}</td>
                <td className="py-3 px-4 text-left text-[#1E2125]">
                  <div className="flex flex-col gap-0.5">
                    {payment.courses.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <span className="truncate" title={c.courseTitle}>
                          {c.courseTitle}
                        </span>
                        <span className="shrink-0 text-[#6A7282]">
                          {c.price.toLocaleString()} 크레딧
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-center font-bold text-[#1E2125]">
                  {payment.totalAmount.toLocaleString()} 크레딧
                </td>
                <td className="py-3 text-center text-[#6A7282]">{payment.paidAt.slice(0, 10)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                page === p
                  ? 'bg-[#1E2125] text-white'
                  : 'text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
              }`}
            >
              {p + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
