'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import RejectModal from '@/components/modals/RejectModal';
import { useToast } from '@/components/ui/ToastContext';
import {
  approveCourseAction,
  fetchCourseRejectReasonsAction,
  rejectCourseAction,
} from '@/features/admin/coursemanage/action';
import { RejectReasonCategory } from '@/features/admin/coursemanage/type';

interface AdminPendingButtonsProps {
  courseId: number;
  courseTitle: string;
}

type CategoryLoadState = 'idle' | 'loading' | 'loaded' | 'failed';

export default function AdminPendingButtons({ courseId, courseTitle }: AdminPendingButtonsProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectCategories, setRejectCategories] = useState<RejectReasonCategory[]>([]);
  const [categoryLoadState, setCategoryLoadState] = useState<CategoryLoadState>('idle');

  const loadRejectCategories = async () => {
    setCategoryLoadState('loading');
    try {
      const categories = await fetchCourseRejectReasonsAction();
      setRejectCategories(categories);
      setCategoryLoadState('loaded');
    } catch {
      setCategoryLoadState('failed');
      showToast('반려 사유 카테고리를 불러오지 못했습니다.', 'negative');
    }
  };

  // 반려 모달을 열기 전에 카테고리 목록을 미리 받아둠
  useEffect(() => {
    loadRejectCategories();
  }, []);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveCourseAction(courseId);
      showToast('강의가 승인되었습니다.', 'positive');
      setShowApproveModal(false);
      router.replace('/admin/coursemanage?tab=pending');
    } catch (error) {
      // 실패 시 모달을 닫지 않아 사용자가 바로 재시도할 수 있게 함
      showToast(error instanceof Error ? error.message : '승인 처리에 실패했습니다.', 'negative');
    } finally {
      setIsLoading(false);
    }
  };

  // RejectModal에는 code 기준 옵션을 넘기고, 콜백도 code를 그대로 받음
  const handleReject = async (categoryCode: string, detail: string) => {
    setIsLoading(true);
    try {
      await rejectCourseAction(courseId, categoryCode, detail);
      showToast('강의가 반려되었습니다.', 'positive');
      setShowRejectModal(false);
      router.replace('/admin/coursemanage?tab=rejected');
    } catch (error) {
      // 실패 시 모달을 닫지 않아 입력했던 상세 사유가 유지됨
      showToast(error instanceof Error ? error.message : '반려 처리에 실패했습니다.', 'negative');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRejectModal = () => {
    if (categoryLoadState === 'failed') {
      // 카테고리 로드가 실패한 상태면 반려 모달 자체를 열지 않고 재시도를 유도
      showToast('반려 사유 카테고리를 다시 불러오는 중입니다...', 'alarm');
      loadRejectCategories();
      return;
    }
    setShowRejectModal(true);
  };

  const isRejectDisabled = isLoading || categoryLoadState === 'loading';

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
        disabled={isRejectDisabled}
        className="w-full h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
        onClick={handleOpenRejectModal}
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
          targetName={courseTitle}
          categories={rejectCategories.map((c) => ({ value: c.code, label: c.label }))}
          detailPlaceholder="반려 사유를 상세히 입력해주세요. 강사에게 전달됩니다."
          onConfirm={handleReject}
          onCancel={() => !isLoading && setShowRejectModal(false)}
          loading={isLoading}
        />
      )}
    </>
  );
}
