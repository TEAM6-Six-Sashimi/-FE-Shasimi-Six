'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchCoursePaymentsAction } from '../actions';
import { AdminCoursePayment } from '../types';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';

export default function CoursePayments() {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminCoursePayment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 검색어는 디바운스 처리
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
      .then(async (result) => {
        if (!active) return;
        if (result.authError) {
          showToast('다른 기기에서 로그인되어 자동 로그아웃 되었습니다.', 'alarm');
          await logoutAction();
          return;
        }
        setItems(result.items);
        setTotalPages(result.totalPages);
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
  }, [startDate, endDate, debouncedKeyword, page, showToast]);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-4">전체 강의 결제 내역</h2>

      <div className="flex items-center justify-between gap-3 mb-6">
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
                <td
                  className="py-3 px-2 text-center text-[#6A7282] truncate"
                  title={payment.orderNo}
                >
                  {payment.orderNo}
                </td>
                <td className="py-3 px-2 text-center font-semibold text-[#1E2125] truncate">
                  {payment.userName}
                </td>
                <td className="py-3 px-2 text-center text-[#6A7282] truncate">{payment.loginId}</td>
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
                <td className="py-3 text-center font-bold text-[#1E2125] break-keep">
                  {payment.totalAmount.toLocaleString()} 크레딧
                </td>
                <td className="py-3 text-center text-[#6A7282]">{payment.paidAt.slice(0, 10)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={page + 1}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p - 1)}
      />
    </div>
  );
}
