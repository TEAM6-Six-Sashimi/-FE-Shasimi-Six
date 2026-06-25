'use client';

import { use, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ApproveConfirmModal from '@/components/modals/ApproveConfirmModal';
import { useToast } from '@/components/ui/ToastContext';
import RejectModal, { RejectCategoryOption } from '@/components/modals/RejectModal';
import { InstructorApplicationDetail } from '@/features/admin/usermanage/types';
import {
  approveInstructorAction,
  rejectInstructorAction,
  getApplicationDetailAction,
} from '@/features/admin/usermanage/actions';

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
    try {
      setLoading(true);
      await approveInstructorAction(Number(applicationId));
      setApproveModalOpen(false);
      // router.push만으로 목적지 페이지(서버 컴포넌트)가 새로 데이터를 불러오므로
      // router.refresh()를 함께 호출하면 라우팅이 겹쳐 화면이 멈춘 것처럼 보일 수 있어 제거함
      router.push(buildListUrlWithToast('approved'));
    } catch {
      showToast('승인 처리에 실패했습니다.', 'negative');
      setLoading(false);
    }
  };

  const handleReject = async (categoryLabel: string, detailText: string) => {
    try {
      setLoading(true);
      // RejectModal이 onConfirm으로 카테고리 "label"을 넘기므로, 백엔드가 기대하는 enum "value"로 변환
      const categoryValue = CATEGORY_VALUE_MAP[categoryLabel] ?? categoryLabel;
      await rejectInstructorAction(Number(applicationId), categoryValue, detailText);
      setRejectModalOpen(false);
      router.push(buildListUrlWithToast('rejected'));
    } catch {
      showToast('반려 처리에 실패했습니다.', 'negative');
      setLoading(false);
    }
  };

  const sectionCls = 'bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7';
  const sectionTitleCls = 'text-[15px] font-bold text-[#1E2125] mb-4';
  const fieldLabelCls = 'text-[11.5px] text-[#9CA3AF] mb-1';
  const fieldValueCls = 'text-[14.5px] font-semibold text-[#1E2125]';

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
    <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col gap-5">
      <button
        onClick={() => router.push(backToListUrl)}
        className="flex items-center gap-1 text-[13px] text-[#6A7282] hover:text-[#1E2125] cursor-pointer"
      >
        &lt; 강사 승인 대기 목록
      </button>

      {/* 지원자 기본 정보 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>지원자 기본 정보</h2>
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <p className={fieldLabelCls}>이름</p>
            <p className={fieldValueCls}>{detail.name ?? '-'}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>회원 ID</p>
            <p className={fieldValueCls}>{detail.loginId ?? '-'}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>이메일</p>
            <p className={fieldValueCls}>{detail.email ?? '-'}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>신청일</p>
            <p className={fieldValueCls}>{detail.createdAt.slice(0, 10)}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>지원 카테고리</p>
            <p className={fieldValueCls}>
              {detail.categoryName ?? `카테고리 #${detail.categoryId}`}
            </p>
          </div>
        </div>
      </div>

      {/* 자기소개 / 지원 동기 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>자기소개</h2>
        <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3 whitespace-pre-wrap">
          {detail.bio}
        </p>

        <h2 className={`${sectionTitleCls} mt-6`}>지원 동기</h2>
        <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3 whitespace-pre-wrap">
          {detail.motivationLetter}
        </p>
      </div>

      {/* 보유 자격증 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>보유 자격증</h2>
        {(detail.certifications?.length ?? 0) === 0 ? (
          <p className="text-[13px] text-[#6A7282]">등록된 자격증이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={fieldLabelCls}>자격증명</p>
              <div className="flex flex-col gap-2 mt-1">
                {(detail.certifications ?? []).map((cert, idx) => (
                  <div
                    key={idx}
                    className="h-10 flex items-center px-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[13px] text-[#1E2125]"
                  >
                    {cert.certificationName}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className={fieldLabelCls}>발급 기관 / 파일</p>
              <div className="flex flex-col gap-2 mt-1">
                {(detail.certifications ?? []).map((cert, idx) => (
                  <div
                    key={idx}
                    className="h-10 flex items-center justify-between px-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[13px] text-[#1E2125]"
                  >
                    <span>{cert.issuedBy}</span>
                    <a
                      href={`/api/files/download?key=${encodeURIComponent(cert.fileUrl)}`}
                      className="text-[12px] text-[#5B8DEE] hover:underline"
                    >
                      다운로드
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 이력서 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>이력서</h2>
        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-[#6A7282]">📄</span>
            <p className="text-[13px] font-medium text-[#1E2125]">이력서 파일</p>
          </div>
          <a
            href={`/api/files/download?key=${encodeURIComponent(detail.resumeFileUrl)}`}
            className="px-3 py-1.5 rounded-md border border-[#D1D5DB] text-[12px] font-medium text-[#1E2125] hover:bg-white transition-colors"
          >
            다운로드
          </a>
        </div>

        {(detail.mainCareers?.length ?? 0) > 0 && (
          <>
            <h3 className="text-[13.5px] font-semibold text-[#1E2125] mb-2">주요 이력</h3>
            <ul className="bg-[#F9FAFB] rounded-lg px-4 py-3 flex flex-col gap-1.5">
              {(detail.mainCareers ?? []).map((item, idx) => (
                <li key={idx} className="text-[13px] text-[#1E2125] flex items-start gap-2">
                  <span className="text-[#6A7282] mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 프로필 사진 */}
      {detail.profileImageUrl && (
        <div className={sectionCls}>
          <h2 className={sectionTitleCls}>프로필 사진</h2>
          <img
            src={detail.profileImageUrl}
            alt="프로필 사진"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
      )}

      {/* 포트폴리오 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>포트폴리오</h2>
        <a
          href={detail.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[13px] text-[#5B8DEE] underline hover:text-[#3B66B9] w-fit"
        >
          <span>🔗</span> {detail.portfolioUrl}
        </a>
      </div>

      {/* 이전 처리 이력 (반려된 적이 있는 경우) */}
      {detail.approvalStatus === 'REJECTED' && detail.rejectionReason && (
        <div className={sectionCls}>
          <h2 className={sectionTitleCls}>반려 사유</h2>
          <p className="text-[13px] text-[#FF5E5E] font-semibold mb-1">
            {detail.rejectionCategory ? CATEGORY_LABEL_MAP[detail.rejectionCategory] : ''}
          </p>
          <p className="text-[13.5px] text-[#1E2125] bg-[#FFEBEB] rounded-lg px-4 py-3">
            {detail.rejectionReason}
          </p>
        </div>
      )}

      {/* 승인 / 반려 버튼: 이미 처리된 신청이면 숨김 */}
      {detail.approvalStatus === 'PENDING' && (
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setApproveModalOpen(true)}
            disabled={loading}
            className="px-8 py-2.5 w-120 h-auto border-2 border-[#CFEE5D] text-[14px] font-semibold text-[#1E2125] bg-white hover:border-[#A8D014] hover:bg-[#F9FBE7] cursor-pointer"
          >
            승인
          </Button>
          <Button
            onClick={() => setRejectModalOpen(true)}
            disabled={loading}
            className="px-8 py-2.5 w-120 h-auto border-2 border-[#FF5E5E] text-[14px] font-semibold text-white bg-[#FF5E5E] hover:bg-[#D14848] hover:border-[#D14848] cursor-pointer"
          >
            반려
          </Button>
        </div>
      )}

      {/* 승인 확인 모달 (공용) */}
      {approveModalOpen && (
        <ApproveConfirmModal
          title="강사 승인"
          targetLabel="승인 대상"
          targetName={detail.name ?? ''}
          description="해당 회원을 강사로 승인하시겠습니까?"
          notice="승인 시 강사 권한이 즉시 부여되고 이메일·시스템 알림이 발송됩니다."
          onConfirm={handleApprove}
          onCancel={() => setApproveModalOpen(false)}
          loading={loading}
        />
      )}

      {/* 반려 입력 모달 (공용) */}
      {rejectModalOpen && (
        <RejectModal
          title="강사 신청 반려"
          targetLabel="반려 대상"
          targetName={`${detail.name ?? ''} (${detail.loginId ?? ''})`}
          categories={INSTRUCTOR_REJECT_CATEGORIES}
          detailPlaceholder="반려 사유를 상세히 입력해주세요. 신청자에게 전달됩니다."
          onConfirm={handleReject}
          onCancel={() => setRejectModalOpen(false)}
          loading={loading}
        />
      )}
    </div>
  );
}
