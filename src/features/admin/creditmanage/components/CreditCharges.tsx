'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchCreditChargesAction } from '../actions';
import { AdminCreditCharge } from '../types';
import Pagination from '@/components/ui/Pagination';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';

export default function CreditCharges() {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminCreditCharge[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const requestIdRef = useRef(0);

  const loadData = (params: {
    startDate: string;
    endDate: string;
    keyword: string;
    page: number;
  }) => {
    const requestId = ++requestIdRef.current;
    fetchCreditChargesAction({
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      keyword: params.keyword || undefined,
      page: params.page,
      size: 10,
    })
      .then(async (result) => {
        if (requestId !== requestIdRef.current) return;
        if (result.authError) {
          showToast('다른 기기에서 로그인되어 자동 로그아웃 되었습니다.', 'alarm');
          await logoutAction();
          return;
        }
        if (result.error) {
          setLoadError(true);
          setItems([]);
          setTotalPages(0);
          return;
        }
        setLoadError(false);
        setItems(result.items);
        setTotalPages(result.totalPages);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setLoadError(true);
        setItems([]);
        setTotalPages(0);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData({ startDate: '', endDate: '', keyword: '', page: 0 });
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-4">크레딧 충전 내역</h2>

      <div className="flex items-center justify-between gap-3 mb-6">
        <SearchInput
          onSearch={(v) => {
            setKeyword(v);
            setPage(0);
            setIsLoading(true);
            loadData({ startDate, endDate, keyword: v, page: 0 });
          }}
          placeholder="회원 ID, 주문번호 검색"
          className="w-72"
        />

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              const value = e.target.value;
              setStartDate(value);
              setPage(0);
              setIsLoading(true);
              loadData({ startDate: value, endDate, keyword, page: 0 });
            }}
            className="h-11 px-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13px] text-[#1E2125] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="text-[#6A7282] text-[13px]">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              const value = e.target.value;
              setEndDate(value);
              setPage(0);
              setIsLoading(true);
              loadData({ startDate, endDate: value, keyword, page: 0 });
            }}
            className="h-11 px-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13px] text-[#1E2125] outline-none focus:border-[#1E2125] transition-colors"
          />
        </div>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[30%] text-center font-semibold text-[#1E2125]">주문번호</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">충전 금액</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">결제 수단</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">실 결제 금액</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">결제 일시</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                불러오는 중...
              </td>
            </tr>
          ) : loadError ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#FF5E5E]">
                충전 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                충전 내역이 없습니다.
              </td>
            </tr>
          ) : (
            items.map((charge) => (
              <tr
                key={charge.orderNo}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{charge.rowNumber}</td>
                <td
                  className="py-3 px-2 text-center text-[#6A7282] truncate"
                  title={charge.orderNo}
                >
                  {charge.orderNo}
                </td>
                <td className="py-3 px-2 text-center font-semibold text-[#1E2125] truncate">
                  {charge.loginId}
                </td>
                <td className="py-3 text-center font-bold text-[#FF5E5E] break-keep">
                  {charge.chargedCredit.toLocaleString()} 크레딧
                </td>
                <td className="py-3 text-center text-[#6A7282]">{charge.paymentMethod}</td>
                <td className="py-3 text-center font-bold text-[#1E2125]">
                  ₩{charge.paidAmount.toLocaleString()}
                </td>
                <td className="py-3 text-center text-[#6A7282]">
                  {charge.approvedAt.replace('T', ' ').slice(0, 16)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={page + 1}
        totalPages={totalPages}
        onPageChange={(p) => {
          const newPage = p - 1;
          setPage(newPage);
          setIsLoading(true);
          loadData({ startDate, endDate, keyword, page: newPage });
        }}
      />
    </div>
  );
}
