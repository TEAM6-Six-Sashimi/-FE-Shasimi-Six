'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';
import OneButtonModal from '@/components/modals/OneButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';
import { requestCoverLetterReviewAction } from '../actions';
import { CoverLetterReviewDetail, CoverLetterReviewSummary } from '../types';

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[#F9FAFB] rounded-sm">
      <span className="text-[13px] text-[#1E2125]">{label}</span>
      <span className="text-[14px] font-bold text-[#FF5E5E]">{value}</span>
    </div>
  );
}

interface SelfIntroSidebarProps {
  initialReview: CoverLetterReviewDetail | null;
  isDirty: boolean;
}

export default function SelfIntroSidebar({ initialReview, isDirty }: SelfIntroSidebarProps) {
  const { showToast } = useToast();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [reviewId, setReviewId] = useState<number | null>(initialReview?.reviewId ?? null);
  const [summary, setSummary] = useState<CoverLetterReviewSummary | null>(
    initialReview?.summary ?? null,
  );

  const handleEvaluate = async () => {
    if (isEvaluating) return;

    if (isDirty) {
      setShowUnsavedModal(true);
      return;
    }

    setIsEvaluating(true);
    try {
      const result = await requestCoverLetterReviewAction();

      if (result.success) {
        setReviewId(result.data.reviewId);
        setSummary(result.data.summary);
      } else if (result.error.authError) {
        showToast(result.error.message, 'alarm');
        await logoutAction();
        return;
      } else {
        showToast(result.error.message, 'negative');
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <>
    <div className="w-full flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3">
        <h2 className="flex items-center gap-1.5 text-[16px] font-bold text-[#1E2125]">
          <Image src="/ai-resume/ai-evaluation.svg" alt="ai 자기소개서 평가" width={18} height={18} />{' '}
          AI 자기소개서 평가
        </h2>

        {isEvaluating ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <InlineDotsLoading dotColor="#5B8DEE" />
            <p className="text-[13px] text-[#6A7282]">AI가 자기소개서를 분석하고 있어요...</p>
          </div>
        ) : !summary ? (
          <p className="text-[13px] text-[#6A7282] leading-relaxed">
            저장된 자기소개서를 AI가 분석하고 개선 방향을 제안해드립니다.
          </p>
        ) : (
          <div className="flex flex-col">
            <div className='mb-5'>
              <h3 className="text-[14px] font-bold text-[#1E2125] mb-2.5">
                항목별 평가 전체 요약
              </h3>
              <div className="flex flex-col gap-2">
                <SummaryRow
                  label="작성 완료 문항"
                  value={`${summary.completedCount}/${summary.totalCount}`}
                />
                <SummaryRow label="수정 필요 문항" value={`${summary.needRevisionCount}개`} />
                <SummaryRow label="보완 권장 문항" value={`${summary.recommendedCount}개`} />
                <SummaryRow
                  label="맞춤법/오타 수정"
                  value={`${summary.spellingCorrectionCount}건`}
                />
                <SummaryRow label="반복 표현" value={`${summary.repeatedExpressionCount}건`} />
                <SummaryRow
                  label="평균 문장 길이"
                  value={`${summary.averageSentenceLength}자`}
                />
              </div>
            </div>

            <div className='mb-3'>
              <h3 className="text-[14px] font-bold text-[#1E2125] mb-2.5">AI 종합 코멘트</h3>
              <p className="bg-[#FEF3C7] text-[#1E2125] text-[12.5px] leading-relaxed px-3 py-2.5 rounded-sm whitespace-pre-line">
                {summary.overallComment}
              </p>
            </div>

            {reviewId !== null && (
              <div className="flex">
                <Link
                  href={`/ai-analysis?tab=self-intro&reviewId=${reviewId}`}
                  className="text-[13px] text-[#FF5E5E] hover:underline"
                >
                  결과 자세히 알아보기 &gt;
                </Link>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full h-11 mt-2 bg-[#5B8DEE] hover:bg-[#3B66B9] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-60"
        >
          {isEvaluating ? '평가 중' : 'AI 평가 시작'}
        </Button>
      </div>
    </div>

    {/* 저장 안 된 상태에서 평가 시작 클릭 시 안내 모달 */}
    {showUnsavedModal && (
      <OneButtonModal
        title="알림"
        message={`변경된 내용이 저장되지 않았습니다. \n 자기소개서를 저장해주세요.`}
        onConfirm={() => setShowUnsavedModal(false)}
      />
    )}
    </>
  );
}
