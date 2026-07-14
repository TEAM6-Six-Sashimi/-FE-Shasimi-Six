import Link from 'next/link';
import Image from 'next/image';
import { fetchNotices } from '@/services/notice.service';

const PREVIEW_COUNT = 3;

export default async function NoticePreviewList() {
  const { items } = await fetchNotices({ page: 0, size: PREVIEW_COUNT });

  // 공지가 3개 미만이어도 항상 3줄을 채워서 보여주고, 빈 자리는 '-'로 표시
  const slots = Array.from({ length: PREVIEW_COUNT }, (_, i) => items[i] ?? null);

  return (
    <section className="py-8 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[26px] font-bold text-[#1E2125]">공지사항</h2>
        <Link
          href="/notice"
          className="text-[13.5px] font-medium text-[#6A7282] hover:text-[#1E2125] transition-colors mr-5"
        >
          더보기 →
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {slots.map((notice, idx) => {
          const rowClassName = `group flex items-center justify-between gap-15 px-10 py-4 border-b border-[#F3F4F6] last:border-none transition-colors ${
            notice?.pinned ? 'bg-[#F9FAFB]' : ''
          }`;

          const rowContent = (
            <>
              <div className="flex items-center gap-8 min-w-0">
                <span className="text-[13px] text-[#9CA3AF] font-medium shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {notice ? (
                  <span className="text-[14.5px] text-[#1E2125] truncate transition-colors group-hover:text-[#FF5E5E] group-hover:underline">
                    {notice.title}
                    {notice.pinned && (
                      <Image
                        src="/pin-Icon.svg"
                        alt="고정"
                        width={13}
                        height={13}
                        className="inline-block align-middle ml-1.5 -mt-0.5"
                      />
                    )}
                  </span>
                ) : (
                  <span className="text-[14.5px] text-[#9CA3AF]">-</span>
                )}
              </div>
              <span className="text-[13px] text-[#9CA3AF] shrink-0">
                {notice ? notice.createdDate : '-'}
              </span>
            </>
          );

          return notice ? (
            <Link key={notice.noticeId} href={`/notice/${notice.noticeId}`} className={rowClassName}>
              {rowContent}
            </Link>
          ) : (
            <div key={`empty-${idx}`} className={rowClassName}>
              {rowContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
