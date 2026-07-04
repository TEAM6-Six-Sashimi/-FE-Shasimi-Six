'use client';

import { Button } from '@/components/ui/button';
import ApproveConfirmModal from '@/components/modals/ApproveConfirmModal';
import RejectModal, { RejectCategoryOption } from '@/components/modals/RejectModal';

interface ApprovalActionsProps {
  applicantName: string;
  applicantLoginId: string;
  categories: RejectCategoryOption[];
  approveModalOpen: boolean;
  rejectModalOpen: boolean;
  loading: boolean;
  onOpenApprove: () => void;
  onOpenReject: () => void;
  onCloseApprove: () => void;
  onCloseReject: () => void;
  onConfirmApprove: () => void;
  onConfirmReject: (categoryLabel: string, detail: string) => void;
}

export default function ApprovalActions({
  applicantName,
  applicantLoginId,
  categories,
  approveModalOpen,
  rejectModalOpen,
  loading,
  onOpenApprove,
  onOpenReject,
  onCloseApprove,
  onCloseReject,
  onConfirmApprove,
  onConfirmReject,
}: ApprovalActionsProps) {
  return (
    <>
      <nav aria-label="강사 신청 처리" className="flex justify-center gap-3">
        <Button
          onClick={onOpenApprove}
          disabled={loading}
          className="px-8 py-2.5 w-120 h-auto border-2 border-[#CFEE5D] text-[14px] font-semibold text-[#1E2125] bg-white hover:border-[#A8D014] hover:bg-[#F9FBE7] cursor-pointer"
        >
          승인
        </Button>
        <Button
          onClick={onOpenReject}
          disabled={loading}
          className="px-8 py-2.5 w-120 h-auto border-2 border-[#FF5E5E] text-[14px] font-semibold text-white bg-[#FF5E5E] hover:bg-[#D14848] hover:border-[#D14848] cursor-pointer"
        >
          반려
        </Button>
      </nav>

      {approveModalOpen && (
        <ApproveConfirmModal
          title="강사 승인"
          targetLabel="승인 대상"
          targetName={applicantName}
          description="해당 회원을 강사로 승인하시겠습니까?"
          notice="승인 시 강사 권한이 즉시 부여되고 이메일·시스템 알림이 발송됩니다."
          onConfirm={onConfirmApprove}
          onCancel={onCloseApprove}
          loading={loading}
        />
      )}

      {rejectModalOpen && (
        <RejectModal
          title="강사 신청 반려"
          targetLabel="반려 대상"
          targetName={`${applicantName} (${applicantLoginId})`}
          categories={categories}
          detailPlaceholder="반려 사유를 상세히 입력해주세요. 신청자에게 전달됩니다."
          onConfirm={onConfirmReject}
          onCancel={onCloseReject}
          loading={loading}
        />
      )}
    </>
  );
}
