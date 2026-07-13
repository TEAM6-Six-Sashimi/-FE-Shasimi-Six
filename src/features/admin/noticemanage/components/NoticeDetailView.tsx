'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/components/ui/ToastContext';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import NoticeContent from '@/components/notice/NoticeContent';
import { deleteNoticeAction } from '../actions';
import { NoticeDetailResult } from '../types';

interface Props {
  result: NoticeDetailResult;
}

export default function NoticeDetailView({ result }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!result.success) return;
    setIsDeleting(true);

    const deleteResult = await deleteNoticeAction(result.data.noticeId);

    if (deleteResult.success) {
      showToast('공지사항이 삭제되었습니다.');
      router.push('/admin/noticemanage');
    } else {
      showToast(deleteResult.message, 'negative');
      setShowDeleteModal(false);
    }
    setIsDeleting(false);
  };

  return (
    <div>
      <Link
        href="/admin/noticemanage"
        className="inline-flex items-center gap-1 text-[13px] text-[#6A7282] hover:text-[#1E2125] mb-4"
      >
        <span>‹</span> 전체 공지 목록
      </Link>
      <h2 className="text-[20px] font-bold text-[#1E2125] mb-6">공지사항 상세</h2>

      {!result.success ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm py-24 text-center text-[#6A7282]">
          {result.message}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            {result.data.pinned ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[11.5px] font-semibold bg-[#FEE2E2] text-[#B91C1C]">
                <Image src="/pin-Icon.svg" alt="" width={11} height={11} />
                고정
              </span>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FF5F5F] text-[#FF5F5F] text-[12.5px] font-semibold hover:bg-[#FFF5F5] transition-colors cursor-pointer"
            >
              <Image src="/delete-Icon-red.svg" alt="" width={13} height={13} />
              삭제
            </button>
          </div>

          <h3 className="text-[20px] font-bold text-[#1E2125] mb-2 wrap-break-word">
            {result.data.title}
          </h3>
          <p className="text-[13px] text-[#6A7282] mb-6">
            등록일 {result.data.createdAt.slice(0, 10)}
          </p>

          <NoticeContent content={result.data.content} />
        </div>
      )}

      {showDeleteModal && (
        <TwoButtonModal
          title="공지사항 삭제"
          message={'삭제하면 복구할 수 없습니다.\n정말 삭제하시겠습니까?'}
          confirmLabel={isDeleting ? '삭제 중...' : '삭제'}
          cancelLabel="취소"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
