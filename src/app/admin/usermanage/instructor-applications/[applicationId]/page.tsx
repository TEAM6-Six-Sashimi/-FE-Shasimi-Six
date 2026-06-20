'use client';

import { use, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ApproveConfirmModal from '@/components/modals/ApproveConfirmModal';
import { useToast } from '@/components/ui/ToastContext';
import RejectModal, { RejectCategoryOption } from '@/components/modals/RejectModal';
import { InstructorApplicationDetail } from '@/features/admin/usermanage/types';
import { approveInstructorAction, rejectInstructorAction } from '@/features/admin/usermanage/actions';

const INSTRUCTOR_REJECT_CATEGORIES: RejectCategoryOption[] = [
  { value: 'CAREER_PROOF_LACK', label: '경력/이력 증빙 부족' },
  { value: 'BASIC_INFO_INSUFFICIENT', label: '기본 정보 미흡' },
  { value: 'IDENTITY_UNVERIFIABLE', label: '신원 확인 불가' },
  { value: 'INAPPROPRIATE_CAREER', label: '부적절한 이력 포함' },
];

// TODO: 실제 API 연결 전까지 사용하는 임시 데이터
const MOCK_DETAIL: InstructorApplicationDetail = {
  name: '김민준',
  loginId: 'minjun01',
  email: 'minjun@email.com',
  phone: '010-1234-5678',
  createdAt: '2026-05-17',
  categoryName: 'AI·데이터',
  introduction:
    '안녕하세요. 저는 AI·데이터 분야에서 5년간 실무 경험을 쌓아온 개발자입니다. 다양한 프로젝트를 통해 쌓은 노하우를 수강생들과 나누고 싶어 강사 지원을 결심했습니다. 현업에서 쌓은 실전 경험을 바탕으로 이론과 실습을 균형 있게 가르치는 것이 제 목표입니다.',
  motivation:
    '온라인 강의 플랫폼을 통해 더 많은 분들이 AI·데이터 분야를 쉽게 접할 수 있도록 돕고 싶습니다. 제가 현업에서 겪었던 시행착오를 줄여드리는 강의를 만들고 싶습니다. 체계적인 커리큘럼으로 수강생들이 빠르게 성장할 수 있도록 돕겠습니다.',
  certifications: [
    {
      certificationName: '정보처리기사',
      issuedBy: '한국산업인력공단',
      fileName: '정보처리기사_자격증.pdf',
      fileUrl: '#',
    },
    {
      certificationName: 'SQLD',
      issuedBy: '한국산업인력공단',
      fileName: 'SQLD_자격증.pdf',
      fileUrl: '#',
    },
  ],
  resumeFileName: '김민준_이력서.pdf',
  resumeFileUrl: '#',
  careerHighlights: [
    '전 네이버 소프트웨어 엔지니어 (5년)',
    '현 프리랜서 개발자 및 교육 강사 (5년)',
    '삼성 SDS 기술 컨설턴트 (3년)',
  ],
  portfolioUrls: ['https://github.com/minjun-dev'],
  agreePrivacy: true,
  agreePublicProfile: true,
  approvalStatus: 'PENDING',
};

interface Props {
  params: Promise<{ applicationId: string }>;
}

export default function InstructorApplicationDetailPage({ params }: Props) {
  const { applicationId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [detail] = useState<InstructorApplicationDetail>(MOCK_DETAIL);
  const [loading, setLoading] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

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
      router.push(buildListUrlWithToast('approved'));
      router.refresh();
    } catch {
      showToast('승인 처리에 실패했습니다.', 'negative');
    } finally {
      setLoading(false);
      setApproveModalOpen(false);
    }
  };

  const handleReject = async (categoryLabel: string, detailText: string) => {
    try {
      setLoading(true);
      const reason = `[${categoryLabel}] ${detailText}`;
      await rejectInstructorAction(Number(applicationId), reason);
      router.push(buildListUrlWithToast('rejected'));
      router.refresh();
    } catch {
      showToast('반려 처리에 실패했습니다.', 'negative');
    } finally {
      setLoading(false);
      setRejectModalOpen(false);
    }
  };

  const sectionCls = 'bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7';
  const sectionTitleCls = 'text-[15px] font-bold text-[#1E2125] mb-4';
  const fieldLabelCls = 'text-[11.5px] text-[#9CA3AF] mb-1';
  const fieldValueCls = 'text-[14.5px] font-semibold text-[#1E2125]';

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
            <p className={fieldValueCls}>{detail.name}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>회원 ID</p>
            <p className={fieldValueCls}>{detail.loginId}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>이메일</p>
            <p className={fieldValueCls}>{detail.email}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>연락처</p>
            <p className={fieldValueCls}>{detail.phone}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>신청일</p>
            <p className={fieldValueCls}>{detail.createdAt}</p>
          </div>
          <div>
            <p className={fieldLabelCls}>지원 카테고리</p>
            <p className={fieldValueCls}>{detail.categoryName}</p>
          </div>
        </div>
      </div>

      {/* 자기소개 / 지원 동기 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>자기소개</h2>
        <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3">
          {detail.introduction}
        </p>

        <h2 className={`${sectionTitleCls} mt-6`}>지원 동기</h2>
        <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3">
          {detail.motivation}
        </p>
      </div>

      {/* 보유 자격증 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>보유 자격증</h2>
        <div className="flex flex-col gap-2 mb-4">
          {detail.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[#6A7282]">📄</span>
                <div>
                  <p className="text-[13px] font-medium text-[#1E2125]">{cert.fileName}</p>
                  <p className="text-[11px] text-[#6A7282]">PDF</p>
                </div>
              </div>
              <a
                href={cert.fileUrl}
                download
                className="px-3 py-1.5 rounded-md border border-[#D1D5DB] text-[12px] font-medium text-[#1E2125] hover:bg-white transition-colors"
              >
                다운로드
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={fieldLabelCls}>자격증명</p>
            <div className="flex flex-col gap-2 mt-1">
              {detail.certifications.map((cert, idx) => (
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
            <p className={fieldLabelCls}>발급 기관</p>
            <div className="flex flex-col gap-2 mt-1">
              {detail.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="h-10 flex items-center px-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] text-[13px] text-[#1E2125]"
                >
                  {cert.issuedBy}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 이력서 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>이력서</h2>
        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] mb-5">
          <div className="flex items-center gap-2.5">
            <span className="text-[#6A7282]">📄</span>
            <div>
              <p className="text-[13px] font-medium text-[#1E2125]">{detail.resumeFileName}</p>
              <p className="text-[11px] text-[#6A7282]">PDF</p>
            </div>
          </div>
          <a
            href={detail.resumeFileUrl}
            download
            className="px-3 py-1.5 rounded-md border border-[#D1D5DB] text-[12px] font-medium text-[#1E2125] hover:bg-white transition-colors"
          >
            다운로드
          </a>
        </div>

        <h3 className="text-[13.5px] font-semibold text-[#1E2125] mb-2">주요 이력</h3>
        <ul className="bg-[#F9FAFB] rounded-lg px-4 py-3 flex flex-col gap-1.5">
          {detail.careerHighlights.map((item, idx) => (
            <li key={idx} className="text-[13px] text-[#1E2125] flex items-start gap-2">
              <span className="text-[#6A7282] mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* 포트폴리오 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>포트폴리오</h2>
        <div className="flex flex-col gap-1.5">
          {detail.portfolioUrls.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] text-[#5B8DEE] underline hover:text-[#3B66B9]"
            >
              <span>🔗</span> {url}
            </a>
          ))}
        </div>
      </div>

      {/* 동의 항목 */}
      <div className={sectionCls}>
        <h2 className={sectionTitleCls}>동의 항목</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[13px] text-[#1E2125]">
            <span className="w-4 h-4 flex items-center justify-center rounded bg-[#CFEE5D] text-[#1E2125] text-[11px]">
              ✓
            </span>
            개인정보 활용에 동의합니다.
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#1E2125]">
            <span className="w-4 h-4 flex items-center justify-center rounded bg-[#CFEE5D] text-[#1E2125] text-[11px]">
              ✓
            </span>
            강사 승인 시 학생에게 정보가 공개됨에 동의합니다.
          </div>
        </div>
      </div>

      {/* 승인 / 반려 버튼 */}
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

      {/* 승인 확인 모달 (공용) */}
      {approveModalOpen && (
        <ApproveConfirmModal
          title="강사 승인"
          targetLabel="승인 대상"
          targetName={detail.name}
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
          targetName={`${detail.name} (${detail.loginId})`}
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