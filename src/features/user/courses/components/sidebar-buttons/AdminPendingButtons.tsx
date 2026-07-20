'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ApproveConfirmModal from '@/components/modals/ApproveConfirmModal';
import RejectModal from '@/components/modals/RejectModal';
import { useToast } from '@/components/ui/ToastContext';
import {
  approveCourseAction,
  fetchCourseRejectReasonsAction,
  rejectCourseAction,
} from '@/features/admin/coursemanage/action';
import { logoutAction } from '@/features/auth/actions';
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

  // label → code (RejectModal이 label을 콜백으로 넘기므로 백엔드 전송 전 역매핑용)
  const categoryValueMap = useMemo(
    () => Object.fromEntries(rejectCategories.map((c) => [c.label, c.code])),
    [rejectCategories],
  );

  const loadRejectCategories = async () => {
    setCategoryLoadState('loading');
    const result = await fetchCourseRejectReasonsAction();

    if (result.success) {
      setRejectCategories(result.data);
      setCategoryLoadState('loaded');
      return;
    }

    if (result.authError) {
      showToast(result.message, 'alarm');
      await logoutAction();
      return;
    }

    setCategoryLoadState('failed');
    showToast('반려 사유 카테고리를 불러오지 못했습니다.', 'negative');
  };

  // 반려 모달을 열기 전에 카테고리 목록을 미리 받아둠
  useEffect(() => {
    loadRejectCategories();
  }, []);

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveCourseAction(courseId);

    if (result.success) {
      showToast('강의가 승인되었습니다.', 'positive');
      setShowApproveModal(false);
      router.replace('/admin/coursemanage?tab=pending');
    } else if (result.authError) {
      showToast(result.message, 'alarm');
      await logoutAction();
      return;
    } else {
      // 실패 시 모달을 닫지 않아 사용자가 바로 재시도할 수 있게 함
      showToast(result.message, 'negative');
    }
    setIsLoading(false);
  };

  // RejectModal은 선택된 값을 label로 변환해 콜백에 넘기므로, 백엔드 전송 전 code로 역매핑한다.
  const handleReject = async (categoryLabel: string, detail: string) => {
    setIsLoading(true);
    const categoryCode = categoryValueMap[categoryLabel] ?? categoryLabel;
    const result = await rejectCourseAction(courseId, categoryCode, detail);

    if (result.success) {
      showToast('강의가 반려되었습니다.', 'positive');
      setShowRejectModal(false);
      router.replace('/admin/coursemanage?tab=rejected');
    } else if (result.authError) {
      showToast(result.message, 'alarm');
      await logoutAction();
      return;
    } else {
      // 실패 시 모달을 닫지 않아 입력했던 상세 사유가 유지됨
      showToast(result.message, 'negative');
    }
    setIsLoading(false);
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
        <ApproveConfirmModal
          title="강의 승인"
          targetLabel="승인 대상"
          targetName={courseTitle}
          description="해당 강의를 승인하시겠습니까?"
          confirmLabel="승인"
          onConfirm={handleApprove}
          onCancel={() => !isLoading && setShowApproveModal(false)}
          loading={isLoading}
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
