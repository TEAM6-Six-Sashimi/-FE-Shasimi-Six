'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import RejectModal, { RejectCategoryOption } from '@/components/modals/RejectModal';
import { useToast } from '@/components/ui/ToastContext';
import { approveCourseAction, fetchCourseRejectReasonsAction, rejectCourseAction } from '@/features/admin/coursemanage/action';

interface AdminPendingButtonsProps {
  courseId: number;
}

export default function AdminPendingButtons({ courseId }: AdminPendingButtonsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectCategories, setRejectCategories] = useState<RejectCategoryOption[]>([]);

  // 반려 모달을 열기 전에 카테고리 목록을 미리 받아둠
  useEffect(() => {
    fetchCourseRejectReasonsAction().then((categories) => {
      setRejectCategories(categories.map((c) => ({ value: c.code, label: c.label })));
    });
  }, []);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveCourseAction(courseId);
      showToast('강의가 승인되었습니다.', 'positive');
      router.replace('/admin/coursemanage?tab=pending');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '승인 처리에 실패했습니다.', 'negative');
    } finally {
      setIsLoading(false);
      setShowApproveModal(false);
    }
  };

  const handleReject = async (categoryLabel: string, detail: string) => {
    const categoryValue =
      rejectCategories.find((c) => c.label === categoryLabel)?.value ?? categoryLabel;

    setIsLoading(true);
    try {
      await rejectCourseAction(courseId, categoryValue, detail);
      showToast('강의가 반려되었습니다.', 'positive');
      router.replace('/admin/coursemanage?tab=rejected');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '반려 처리에 실패했습니다.', 'negative');
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
          confirmLabel={isLoading ? '처리 중...' : '승인'}
          cancelLabel="취소"
          onConfirm={handleApprove}
          onCancel={() => !isLoading && setShowApproveModal(false)}
        />
      )}

      {showRejectModal && (
        <RejectModal
          title="강의 반려"
          targetLabel="반려 대상"
          targetName={`강의 ID: ${courseId}`}
          categories={rejectCategories}
          detailPlaceholder="반려 사유를 상세히 입력해주세요. 강사에게 전달됩니다."
          onConfirm={handleReject}
          onCancel={() => !isLoading && setShowRejectModal(false)}
          loading={isLoading}
        />
      )}
    </>
  );
}