'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { RejectCategoryOption } from '@/components/modals/RejectModal';
import { InstructorApplicationDetail } from '@/features/admin/usermanage/types';
import {
  approveInstructorAction,
  rejectInstructorAction,
  getApplicationDetailAction,
} from '@/features/admin/usermanage/actions';
import ApplicantInfo from '@/features/admin/usermanage/components/instructor-application-detail/ApplicantInfo';
import Introduction from '@/features/admin/usermanage/components/instructor-application-detail/Introduction';
import Certifications from '@/features/admin/usermanage/components/instructor-application-detail/Certification';
import Resume from '@/features/admin/usermanage/components/instructor-application-detail/Resume';
import PortfolioSection from '@/features/admin/usermanage/components/instructor-application-detail/Portfolio';
import RejectionReason from '@/features/admin/usermanage/components/instructor-application-detail/RejectionReason';
import ApprovalActions from '@/features/admin/usermanage/components/instructor-application-detail/ApprovalActions';

const INSTRUCTOR_REJECT_CATEGORIES: RejectCategoryOption[] = [
  { value: 'INSUFFICIENT_CAREER_PROOF', label: '경력/이력 증빙 부족' },
  { value: 'INSUFFICIENT_BASIC_INFO', label: '기본 정보 미흡' },
  { value: 'UNABLE_TO_VERIFY_IDENTITY', label: '신원 확인 불가' },
  { value: 'INAPPROPRIATE_CAREER_INCLUDED', label: '부적절한 이력 포함' },
];

// value → label (반려 사유 표시용)
const CATEGORY_LABEL_MAP: Record<string, string> = INSTRUCTOR_REJECT_CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.value]: c.label }),
  {},
);

// label → value (RejectModal이 label을 콜백으로 넘기므로 백엔드 전송 전 역매핑용)
const CATEGORY_VALUE_MAP: Record<string, string> = INSTRUCTOR_REJECT_CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.label]: c.value }),
  {},
);

interface Props {
  params: Promise<{ applicationId: string }>;
}

export default function InstructorApplicationDetailPage({ params }: Props) {
  const { applicationId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<InstructorApplicationDetail | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setIsFetching(true);
    getApplicationDetailAction(Number(applicationId))
      .then((data) => {
        if (active) setDetail(data);
      })
      .finally(() => {
        if (active) setIsFetching(false);
      });
    return () => {
      active = false;
    };
  }, [applicationId]);

  // 강사 승인 대기 목록에서 들어왔으면 그 탭으로, 아니면 기본(전체 회원) 탭으로 복귀
  const fromTab = searchParams.get('from') === 'approval' ? 'approval' : 'all';
  const backToListUrl =
    fromTab === 'approval' ? '/admin/usermanage?tab=approval' : '/admin/usermanage';

  const buildListUrlWithToast = (toast: string) => {
    const separator = backToListUrl.includes('?') ? '&' : '?';
    return `${backToListUrl}${separator}toast=${toast}`;
  };

  const handleApprove = async () => {
    setLoading(true);
    const result = await approveInstructorAction(Number(applicationId));

    if (result.success) {
      setApproveModalOpen(false);
      router.push(buildListUrlWithToast('approved'));
    } else {
      showToast(result.message, 'negative');
      setLoading(false);
    }
  };

  const handleReject = async (categoryLabel: string, detailText: string) => {
    setLoading(true);
    const categoryValue = CATEGORY_VALUE_MAP[categoryLabel] ?? categoryLabel;
    const result = await rejectInstructorAction(Number(applicationId), categoryValue, detailText);

    if (result.success) {
      setRejectModalOpen(false);
      router.push(buildListUrlWithToast('rejected'));
    } else {
      showToast(result.message, 'negative');
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center text-[#6A7282]">
        지원자 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center text-[#6A7282]">
        지원 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-3 flex flex-col gap-5">
      <header>
        <button
          onClick={() => router.push(backToListUrl)}
          className="flex items-center gap-1 text-[13px] text-[#6A7282] hover:text-[#1E2125] cursor-pointer"
        >
          &lt; 강사 승인 대기 목록
        </button>
      </header>

      <ApplicantInfo detail={detail} />

      <Introduction bio={detail.bio} motivationLetter={detail.motivationLetter} />

      <Certifications certifications={detail.certifications} />

      <Resume resumeFileUrl={detail.resumeFileUrl} mainCareers={detail.mainCareers} />

      <PortfolioSection portfolioUrl={detail.portfolioUrl} />

      {detail.approvalStatus === 'REJECTED' && detail.rejectionReason && (
        <RejectionReason
          categoryLabel={
            detail.rejectionCategory ? CATEGORY_LABEL_MAP[detail.rejectionCategory] : ''
          }
          reason={detail.rejectionReason}
        />
      )}

      {detail.approvalStatus === 'PENDING' && (
        <ApprovalActions
          applicantName={detail.name ?? ''}
          applicantLoginId={detail.loginId ?? ''}
          categories={INSTRUCTOR_REJECT_CATEGORIES}
          approveModalOpen={approveModalOpen}
          rejectModalOpen={rejectModalOpen}
          loading={loading}
          onOpenApprove={() => setApproveModalOpen(true)}
          onOpenReject={() => setRejectModalOpen(true)}
          onCloseApprove={() => setApproveModalOpen(false)}
          onCloseReject={() => setRejectModalOpen(false)}
          onConfirmApprove={handleApprove}
          onConfirmReject={handleReject}
        />
      )}
    </main>
  );
}
