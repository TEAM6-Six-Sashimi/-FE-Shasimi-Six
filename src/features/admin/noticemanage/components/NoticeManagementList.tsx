'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { fetchNoticesAction } from '../actions';
import { AdminNotice } from '../types';

const ITEMS_PER_PAGE = 10;

export default function NoticeManagementList() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [debouncedTitle, setDebouncedTitle] = useState('');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminNotice[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 검색어는 디바운스 처리 - 타이핑 중 매번 서버 조회하지 않도록
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTitle(title.trim()), 300);
    return () => clearTimeout(timer);
  }, [title]);

  // 검색 조건이 바뀌면 첫 페이지로
  useEffect(() => {
    setPage(0);
  }, [debouncedTitle]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchNoticesAction({
      title: debouncedTitle || undefined,
      page,
      size: ITEMS_PER_PAGE,
    })
      .then((result) => {
        if (!active) return;
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
  }, [debouncedTitle, page]);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">전체 공지사항 목록</h2>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목 검색"
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
        </div>
        <Button
          onClick={() => router.push('/admin/noticemanage/edit')}
          className="h-10 px-4 bg-[#FF5F5F] hover:bg-[#D14848] text-white text-[13px] font-semibold cursor-pointer"
        >
          + 공지사항 작성
        </Button>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[52%] text-left pl-2 font-semibold text-[#1E2125]">제목</th>
            <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">고정 여부</th>
            <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">등록 날짜</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="py-16 text-center text-[#6A7282]">
                불러오는 중...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-16 text-center text-[#6A7282]">
                {debouncedTitle
                  ? '검색 결과에 해당하는 공지사항이 없습니다.'
                  : '등록된 공지사항이 없습니다.'}
              </td>
            </tr>
          ) : (
            items.map((notice, idx) => (
              <tr
                key={notice.noticeId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {page * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="py-3 px-2 text-left font-semibold text-[#1E2125] truncate">
                  {notice.title}
                  {notice.pinned && (
                    <Image
                      src="/pin-Icon.svg"
                      alt="고정"
                      width={15}
                      height={15}
                      className="inline-block align-middle ml-1.5 -mt-0.5"
                    />
                  )}
                </td>
                <td className="py-3 text-center">
                  {notice.pinned ? (
                    <span className="inline-block px-2.5 py-1 rounded-sm text-[11.5px] font-semibold bg-[#FEE2E2] text-[#B91C1C]">
                      고정
                    </span>
                  ) : (
                    <span className="text-[#6A7282]">—</span>
                  )}
                </td>
                <td className="py-3 text-center text-[#6A7282]">{notice.createdDate}</td>
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
