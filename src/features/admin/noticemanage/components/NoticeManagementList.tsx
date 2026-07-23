'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/Pagination';
import SearchInput from '@/components/ui/SearchInput';
import { fetchNoticesAction } from '../actions';
import { AdminNotice } from '../types';

const ITEMS_PER_PAGE = 10;
// 공지사항 API가 title 파라미터로 서버 필터링을 지원하지 않아, 전체 목록을 한 번에 받아와 프론트에서 검색/페이지네이션한다
// (백엔드가 size=1000 요청을 400으로 거부해 페이지당 100개씩 나눠 끝까지 순회한다)
const FETCH_PAGE_SIZE = 100;

export default function NoticeManagementList() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // null = 아직 조회 전 (로딩 상태를 별도 state 대신 이 값으로 파생시킨다)
  const [notices, setNotices] = useState<AdminNotice[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const isLoading = notices === null && !loadError;

  useEffect(() => {
    let active = true;

    (async () => {
      const all: AdminNotice[] = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const result = await fetchNoticesAction({ page, size: FETCH_PAGE_SIZE });
        if (!active) return;
        if (result.error) {
          setLoadError(true);
          return;
        }
        all.push(...result.items);
        totalPages = result.totalPages;
        page += 1;
      }

      setNotices(all);
    })();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const list = notices ?? [];
    if (!title) return list;
    const keyword = title.toLowerCase();
    return list.filter((n) => n.title.toLowerCase().includes(keyword));
  }, [notices, title]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-4">전체 공지사항 목록</h2>

      <div className="flex items-center justify-between mb-6">
        <SearchInput
          onSearch={(v) => {
            setTitle(v);
            setCurrentPage(1);
          }}
          placeholder="제목 검색"
          className="w-72"
        />
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
            <th className="py-3 w-[52%] text-center font-semibold text-[#1E2125]">제목</th>
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
          ) : loadError ? (
            <tr>
              <td colSpan={4} className="py-16 text-center text-[#FF5E5E]">
                공지사항을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
              </td>
            </tr>
          ) : paged.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-16 text-center text-[#6A7282]">
                {title
                  ? '검색 결과에 해당하는 공지사항이 없습니다.'
                  : '등록된 공지사항이 없습니다.'}
              </td>
            </tr>
          ) : (
            paged.map((notice, idx) => (
              <tr
                key={notice.noticeId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="py-3 px-2 text-left">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Link
                      href={`/admin/noticemanage/${notice.noticeId}`}
                      className="truncate font-semibold text-[#1E2125] hover:text-[#FF5E5E] hover:underline transition-colors"
                    >
                      {notice.title}
                    </Link>
                    {notice.pinned && (
                      <Image
                        src="/pin-Icon.svg"
                        alt="고정"
                        width={15}
                        height={15}
                        className="shrink-0"
                      />
                    )}
                  </div>
                </td>
                <td className="py-3 text-center">
                  {notice.pinned ? (
                    <span className="inline-block px-2.5 py-1 rounded-sm text-[11.5px] font-semibold bg-[#FEE2E2] text-[#FF5E5E]">
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
