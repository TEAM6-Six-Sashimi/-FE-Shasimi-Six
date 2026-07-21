'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchNoticesAction } from '@/features/admin/noticemanage/actions';
import { AdminNotice } from '@/features/admin/noticemanage/types';

const ITEMS_PER_PAGE = 10;

interface NoticeListViewProps {
  initialItems: AdminNotice[];
  initialTotalPages: number;
}

export default function NoticeListView({ initialItems, initialTotalPages }: NoticeListViewProps) {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<AdminNotice[]>(initialItems);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  // 최초 페이지(0)는 서버에서 이미 받아온 initialItems를 그대로 쓰고,
  // 페이지 이동으로 page가 바뀔 때만 클라이언트에서 다시 조회한다.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let active = true;
    setIsLoading(true);
    fetchNoticesAction({ page, size: ITEMS_PER_PAGE })
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
  }, [page]);

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[#1E2125] mb-6">공지사항 목록</h1>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-[13px] table-fixed">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">#</th>
              <th className="py-3 px-2 text-center font-semibold text-[#1E2125]">제목</th>
              <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">등록일</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-16 text-center text-[#6A7282]">
                  불러오는 중...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-16 text-center text-[#6A7282]">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((notice, idx) => (
                <tr key={notice.noticeId} className="border-b border-[#F3F4F6] last:border-none">
                  <td className="py-4 w-[8%] text-center text-[#9CA3AF] font-medium">
                    {String(page * ITEMS_PER_PAGE + idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-4 px-2 text-left">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Link
                        href={`/notice/${notice.noticeId}`}
                        className="truncate text-[14.5px] text-[#1E2125] hover:text-[#FF5E5E] hover:underline transition-colors"
                      >
                        {notice.title}
                      </Link>
                      {notice.pinned && (
                        <Image
                          src="/pin-Icon.svg"
                          alt="고정"
                          width={13}
                          height={13}
                          className="shrink-0"
                        />
                      )}
                    </div>
                  </td>
                  <td className="py-4 w-[18%] text-center text-[#9CA3AF]">
                    {notice.createdDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
