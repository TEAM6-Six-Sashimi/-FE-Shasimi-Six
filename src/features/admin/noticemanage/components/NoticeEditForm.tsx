'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import NoticeContentField from './NoticeContentField';
import { createNoticeAction } from '../actions';

export default function NoticeEditForm() {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const canSubmit = title.trim() !== '' && content.trim() !== '' && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setShowConfirmModal(false);
    setIsSubmitting(true);

    const result = await createNoticeAction({
      title: title.trim(),
      content: content.trim(),
      pinned,
    });

    if (result.success) {
      showToast('공지사항이 등록되었습니다.');
      router.push('/admin/noticemanage');
    } else if (result.authError) {
      showToast(result.message, 'alarm');
      await logoutAction();
      return;
    } else {
      showToast(result.message, 'negative');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <h2 className="text-[18px] font-extrabold text-[#1E2125] mb-6">공지사항 작성</h2>

      <div className="mb-5">
        <div className="flex mb-2">
          <p className="text-[15px] font-semibold text-[#1E2125]">제목</p>
          <p className="text-[#FF5F5F]">*</p>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="공지사항 제목을 입력하세요"
          className="w-full h-11 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
        />
      </div>

      <NoticeContentField value={content} onChange={setContent} />

      <label className="flex items-center gap-2 w-fit cursor-pointer mb-1 mt-8">
        <span className="relative inline-flex items-center justify-center w-4 h-4 shrink-0">
          <input
            type="checkbox"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
            className="peer appearance-none w-4 h-4 rounded border border-[#D1D5DB] checked:bg-[#FF5F5F] checked:border-[#FF5F5F] cursor-pointer transition-colors"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute w-2.5 h-2.5 opacity-0 peer-checked:opacity-100"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-[13.5px] font-semibold text-[#DC2626]">공지사항 고정하기</span>
      </label>
      <p className="text-[12px] text-[#6A7282] mb-6">
        고정을 풀려면 공지사항 삭제 후 다시 작성해야 합니다.
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => setShowConfirmModal(true)}
          disabled={!canSubmit}
          className={`flex-1 h-12 text-[15px] font-semibold transition-colors cursor-pointer ${
            canSubmit
              ? 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
              : 'bg-[#D1D5DB] text-white cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '등록 중...' : '등록하기'}
        </Button>
        <Button
          type="button"
          onClick={() => setShowCancelModal(true)}
          className="flex-1 h-12 text-[15px] font-semibold bg-white border border-[#D1D5DB] text-[#1E2125] hover:bg-[#F9FAFB] cursor-pointer"
        >
          취소
        </Button>
      </div>

      {showConfirmModal && (
        <TwoButtonModal
          title="공지사항 등록 확인"
          message={'공지사항을 등록하시겠습니까?'}
          confirmLabel="등록"
          cancelLabel="취소"
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showCancelModal && (
        <TwoButtonModal
          title="공지사항 등록 취소 확인"
          message={'작성한 내용이 저장되지 않고 사라집니다.\n등록을 취소하시겠습니까?'}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => router.push('/admin/noticemanage')}
          onCancel={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}
