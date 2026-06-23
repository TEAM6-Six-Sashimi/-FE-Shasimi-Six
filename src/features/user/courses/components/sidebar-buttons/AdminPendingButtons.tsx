// src/features/user/courses/components/sidebar-buttons/AdminPendingButtons.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import OneButtonModal from '@/components/modals/OneButtonModal';
// import { approveCourseAction, rejectCourseAction } from '../../actions'; // 추후 연동

interface AdminPendingButtonsProps {
  courseId: number;
}

export default function AdminPendingButtons({ courseId }: AdminPendingButtonsProps) {
  const router = useRouter();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // await approveCourseAction(courseId); // 추후 연동
      router.push('/admin/coursemanage/pending');
    } catch {
      setErrorMessage('승인 처리에 실패했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
      setShowApproveModal(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setErrorMessage('반려 사유를 입력해주세요.');
      setShowErrorModal(true);
      return;
    }
    setIsLoading(true);
    try {
      // await rejectCourseAction(courseId, rejectReason); // 추후 연동
      router.push('/admin/coursemanage/pending');
    } catch {
      setErrorMessage('반려 처리에 실패했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
      setShowRejectModal(false);
    }
  };

  return (
    <>
      <Button
        disabled={isLoading}
        className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
        onClick={() => setShowApproveModal(true)}
      >
        승인하기
      </Button>
      <Button
        variant="outline"
        disabled={isLoading}
        className="w-full h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
        onClick={() => setShowRejectModal(true)}
      >
        반려하기
      </Button>

      {showApproveModal && (
        <TwoButtonModal
          title="승인 확인"
          message="해당 강의를 승인하시겠습니까?"
          confirmLabel="승인"
          cancelLabel="취소"
          onConfirm={handleApprove}
          onCancel={() => setShowApproveModal(false)}
        />
      )}

      {/* 반려 사유 입력 모달 - 입력 필드가 필요해 TwoButtonModal과 별도 구성 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-[16px] font-bold text-[#1E2125] mb-3">반려 사유 입력</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="반려 사유를 입력해주세요."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isLoading}
                className="px-5 py-2 rounded border-2 border-[#D1D5DB] text-[13px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] cursor-pointer transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-5 py-2 rounded border-2 border-[#FF5E5E] bg-[#FF5E5E] text-[13px] font-semibold text-white hover:bg-[#D14848] hover:border-[#D14848] cursor-pointer transition-colors disabled:opacity-50"
              >
                {isLoading ? '처리 중...' : '반려'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showErrorModal && (
        <OneButtonModal
          title="알림"
          message={errorMessage}
          confirmLabel="확인"
          onConfirm={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
}