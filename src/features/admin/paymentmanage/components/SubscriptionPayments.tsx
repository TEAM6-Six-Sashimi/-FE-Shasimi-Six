'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { fetchSubscriptionPaymentsAction } from '../actions';
import { AdminSubscriptionPayment, SubscriptionPlanCode } from '../types';
import Pagination from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';

type PlanFilter = 'ALL' | SubscriptionPlanCode;

const PLAN_FILTER_LABEL: Record<PlanFilter, string> = {
  ALL: '전체',
  MONTHLY: '1개월권',
  ANNUAL: '12개월권',
};

const PLAN_BADGE_STYLE: Record<SubscriptionPlanCode, string> = {
  MONTHLY: 'bg-[#DBEAFE] text-[#1D4ED8]',
  ANNUAL: 'bg-[#FEF3C7] text-[#92400E]',
};

export default function SubscriptionPayments() {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('ALL');
  const [planMenuOpen, setPlanMenuOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminSubscriptionPayment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const planMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword.trim()), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    setPage(0);
  }, [startDate, endDate, debouncedKeyword, planFilter]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchSubscriptionPaymentsAction({
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

  // 드롭다운 바깥을 클릭하면 닫기
  useEffect(() => {
    if (!planMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (planMenuRef.current && !planMenuRef.current.contains(e.target as Node)) {
        setPlanMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [planMenuOpen]);

  // 플랜 필터 - 현재 페이지 내에서만 보조 필터링
  const filteredItems =
    planFilter === 'ALL' ? items : items.filter((item) => item.planCode === planFilter);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-4">전체 구독권 결제 내역</h2>

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
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">주문번호</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">회원명</th>
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">
              <div ref={planMenuRef} className="relative inline-flex items-center gap-1 justify-center w-full">
                <button
                  type="button"
                  onClick={() => setPlanMenuOpen((open) => !open)}
                  title="1개월권 / 12개월권 필터 가능"
                  className="inline-flex items-center gap-1 cursor-pointer hover:text-[#FF5E5E] transition-colors"
                >
                  구독 플랜
                  <span aria-hidden="true">{planFilter !== 'ALL' ? '●' : '▾'}</span>
                </button>
                {planMenuOpen && (
                  <div className="absolute top-full mt-2 z-10 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 min-w-24">
                    {(['ALL', 'MONTHLY', 'ANNUAL'] as PlanFilter[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setPlanFilter(option);
                          setPlanMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-[12.5px] font-medium hover:bg-[#F9FAFB] cursor-pointer ${
                          planFilter === option ? 'text-[#FF5E5E]' : 'text-[#1E2125]'
                        }`}
                      >
                        {PLAN_FILTER_LABEL[option]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">결제 금액</th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">결제일</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                불러오는 중...
              </td>
            </tr>
          ) : filteredItems.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                결제 내역이 없습니다.
              </td>
            </tr>
          ) : (
            filteredItems.map((payment) => (
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
                <td className="py-3 px-2 text-center text-[#6A7282] truncate">
                  {payment.loginId}
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${PLAN_BADGE_STYLE[payment.planCode]}`}
                  >
                    {payment.planName}
                  </span>
                </td>
                <td className="py-3 text-center font-bold text-[#1E2125] break-keep">
                  {payment.amount.toLocaleString()} 크레딧
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
