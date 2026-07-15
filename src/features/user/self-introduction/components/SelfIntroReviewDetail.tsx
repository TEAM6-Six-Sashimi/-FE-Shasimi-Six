'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCoverLetterReviewByIdAction } from '../actions';
import {
  CoverLetterReviewDetailResult,
  CoverLetterReviewQuestion,
  getQuestionStatusMeta,
} from '../types';

interface SelfIntroReviewDetailProps {
  reviewId: number;
}

const CORRECTIONS_PREVIEW_COUNT = 5;

function QuestionCard({ question }: { question: CoverLetterReviewQuestion }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusMeta = getQuestionStatusMeta(question.status);

  if (question.status === 'EMPTY') {
    return (
      <div className="border-t border-[#F3F4F6] pt-6 first:border-t-0 first:pt-0">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[16px] font-bold text-[#1E2125]">
            {question.questionTitle} ({question.maxLength}자)
          </h3>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta.bg} ${statusMeta.text}`}
          >
            {statusMeta.label}
          </span>
        </div>
        <p className="text-[13px] text-[#6A7282] bg-[#F9FAFB] rounded-lg px-4 py-3">
          {question.summaryFeedback}
        </p>
      </div>
    );
  }

  const visibleCorrections = isExpanded
    ? question.spellingCorrections
    : question.spellingCorrections.slice(0, CORRECTIONS_PREVIEW_COUNT);
  const hiddenCount = question.spellingCorrections.length - CORRECTIONS_PREVIEW_COUNT;

  return (
    <div className="border-t border-[#F3F4F6] pt-6 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[16px] font-bold text-[#1E2125]">
          {question.questionTitle} ({question.maxLength}자)
        </h3>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusMeta.bg} ${statusMeta.text}`}
        >
          {statusMeta.label}
        </span>
      </div>

      <div className="border border-[#E5E7EB] rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 md:divide-x md:divide-[#E5E7EB]">
        {/* 맞춤법·오타 수정 */}
        <div className="p-5 flex flex-col max-h-80">
          <h4 className="shrink-0 text-[13.5px] font-bold text-[#1E2125] mb-3">
            맞춤법·오타 수정 (총 {question.spellingCorrectionCount}건)
          </h4>
          {question.spellingCorrections.length === 0 ? (
            <p className="text-[12.5px] text-[#9CA3AF]">수정할 맞춤법·오타가 없습니다.</p>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 divide-y divide-[#F3F4F6]">
              {visibleCorrections.map((correction, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-3 py-2 text-[12.5px]">
                  <span className="text-[#9CA3AF] line-through truncate">
                    {correction.original}
                  </span>
                  <span className="text-[#1E2125] truncate">{correction.corrected}</span>
                </div>
              ))}
            </div>
          )}
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="shrink-0 w-full flex items-center justify-center gap-1 mt-2 py-1.5 text-[12px] text-[#6A7282] hover:text-[#1E2125] cursor-pointer transition-colors"
            >
              {isExpanded ? '접기' : `외 ${hiddenCount}건 보기`}
              <span
                className="inline-block transition-transform"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
              >
                ⌄
              </span>
            </button>
          )}
        </div>

        {/* 종합 첨삭 피드백 */}
        <div className="p-5 flex flex-col max-h-80">
          <h4 className="shrink-0 text-[13.5px] font-bold text-[#1E2125] mb-3">종합 첨삭 피드백</h4>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <p className="text-[12.5px] text-[#374151] leading-relaxed whitespace-pre-line mb-4">
              {question.feedback}
            </p>
            {question.improvedExample && (
              <div className="bg-[#FEF3C7] border border-[#ECFCCB] rounded-lg p-4">
                <p className="text-[12.5px] font-bold text-[#92400E] mb-1.5">AI 개선 예시</p>
                <p className="text-[12.5px] text-[#1E2125] leading-relaxed whitespace-pre-line">
                  {question.improvedExample}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SelfIntroReviewDetail({ reviewId }: SelfIntroReviewDetailProps) {
  const [review, setReview] = useState<CoverLetterReviewDetailResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setNotFound(false);

    fetchCoverLetterReviewByIdAction(reviewId).then((result) => {
      if (!active) return;
      if (!result) {
        setNotFound(true);
      } else {
        setReview(result);
      }
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [reviewId]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-[#1E2125]">AI 첨삭 상세 결과</h2>
        <Link
          href="/ai-analysis?tab=self-intro"
          className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[13px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] transition-colors"
        >
          나의 자기소개서 보기
        </Link>
      </div>

      {isLoading ? (
        <p className="text-[13px] text-[#6A7282] py-10 text-center">불러오는 중...</p>
      ) : notFound || !review ? (
        <p className="text-[13px] text-[#6A7282] py-10 text-center">
          첨삭 결과를 찾을 수 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {review.questions.map((question) => (
            <QuestionCard key={question.questionNumber} question={question} />
          ))}
        </div>
      )}
    </div>
  );
}
