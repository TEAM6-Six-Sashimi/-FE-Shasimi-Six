import Link from 'next/link';
import Image from 'next/image';
import NoticeContent from '@/components/notice/NoticeContent';
import { NoticeDetailResult } from '@/features/admin/noticemanage/types';

interface Props {
  result: NoticeDetailResult;
}

export default function NoticeDetailView({ result }: Props) {
  return (
    <div>
      <Link
        href="/notice"
        className="inline-flex items-center gap-1 text-[13px] text-[#6A7282] hover:text-[#1E2125] mb-4"
      >
        <span>‹</span> 전체 공지 목록
      </Link>

      {!result.success ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm py-24 text-center text-[#6A7282]">
          {result.message}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm">
          <h3 className="text-[20px] font-bold text-[#1E2125] mb-2 wrap-break-word">
            {result.data.title}
            {result.data.pinned && (
              <span className="inline-flex items-center gap-1 align-middle ml-2 px-2.5 py-1 mb-1.5 rounded-sm text-[11.5px] font-semibold bg-[#FEE2E2] text-[#FF5E5E]">
                <Image src="/pin-Icon.svg" alt="" width={11} height={11} />
                고정
              </span>
            )}
          </h3>
          <p className="text-[13px] text-[#6A7282] mb-6">
            등록일 {result.data.createdAt.slice(0, 10)}
          </p>

          <NoticeContent content={result.data.content} />
        </div>
      )}
    </div>
  );
}
