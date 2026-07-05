'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import OneButtonModal from '@/components/modals/OneButtonModal';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { requestAiReviewAction } from '../actions';
import { AiReviewResult, getGradeColor } from '../types';

interface ResumeSidebarProps {
  isSaved: boolean;
  resumeId: number | null;
}

function ScoreCircle({ score }: { score: number }) {
  const data = [{ value: score, fill: '#5B8DEE' }];

  return (
    <div className="relative w-44 h-44 mx-auto">
      <RadialBarChart
        width={176}
        height={176}
        innerRadius="75%"
        outerRadius="100%"
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          dataKey="value"
          background={{ fill: '#E5E7EB' }}
          cornerRadius={10}
          angleAxisId={0}
        />
      </RadialBarChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[40px] font-bold text-[#5B8DEE] leading-none">{score}</span>
        <span className="text-[13px] text-[#9CA3AF] mt-1">/ 100점</span>
      </div>
    </div>
  );
}

export default function ResumeSidebar({ isSaved, resumeId }: ResumeSidebarProps) {
  const router = useRouter();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AiReviewResult | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const handleEvaluate = async () => {
    if (!isSaved || resumeId === null) {
      setShowUnsavedModal(true);
      return;
    }

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const result = await requestAiReviewAction(resumeId);

      if (result.success) {
        setEvaluationResult(result.data);
      } else if (result.error.errorCode === 'SUBSCRIPTION_007') {
        // 구독 플랜 필요 - 안내 모달
        setShowSubscribeModal(true);
      }
      // 그 외 에러는 우선 조용히 처리 (필요 시 별도 토스트/모달 추가 가능)
    } finally {
      setIsEvaluating(false);
    }
  };

  const improvementFeedbacks =
    evaluationResult?.feedbacks.filter((fb) => fb.type === 'IMPROVEMENT') ?? [];

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3">
          <h2 className="flex items-center gap-1.5 text-[16px] font-bold text-[#1E2125]">
            <Image src="/ai-resume/ai-evaluation.svg" alt="ai 이력서 평가" width={18} height={18} />{' '}
            AI 이력서 평가
          </h2>

          {!evaluationResult ? (
            <p className="text-[13px] text-[#6A7282] leading-relaxed">
              저장된 이력서를 AI가 분석하고 개선 방향을 제안해드립니다.
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              <div>
                <ScoreCircle score={evaluationResult.overallScore} />
                <p className="text-center text-[14px] font-bold text-[#1E2125] mt-3">
                  이력서 완성도
                </p>
              </div>

              <div>
                <h3 className="text-[14px] font-bold text-[#1E2125] mb-2.5">항목별 평가 결과</h3>
                <div className="flex flex-col gap-2">
                  {evaluationResult.sectionScores.map((section) => {
                    const { bg, text } = getGradeColor(section.score);
                    return (
                      <div
                        key={section.type}
                        className="flex items-center justify-between px-3 py-2.5 bg-[#F9FAFB] rounded-lg"
                      >
                        <span className="text-[13px] text-[#1E2125]">{section.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-[#1E2125]">
                            {section.score}점
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${bg} ${text}`}
                          >
                            {section.grade}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {improvementFeedbacks.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-bold text-[#1E2125] mb-2.5">
                    보완이 필요한 항목
                  </h3>
                  <div className="flex flex-col gap-2">
                    {improvementFeedbacks.map((fb, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 px-3 py-2.5 bg-[#FEF3C7] rounded-lg"
                      >
                        <span className="text-[#92400E] text-[13px] mt-0.5">⚠</span>
                        <p className="text-[12.5px] text-[#1E2125] leading-relaxed">{fb.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="w-full h-11 bg-[#5B8DEE] hover:bg-[#3B66B9] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-60"
          >
            {isEvaluating ? '평가 중...' : 'AI 평가 시작'}
          </Button>
        </div>
      </div>

      {/* 저장 안 된 상태에서 평가 시작 클릭 시 안내 모달 */}
      {showUnsavedModal && (
        <OneButtonModal
          title="알림"
          message="변경된 이력서 내용이 저장되지 않았습니다. 이력서를 저장해주세요."
          onConfirm={() => setShowUnsavedModal(false)}
        />
      )}

      {/* 구독 플랜 필요 모달 */}
      {showSubscribeModal && (
        <TwoButtonModal
          title="AI 구독 플랜 필요"
          message={
            "해당 기능은 핏격 AI 구독 플랜 이용자만 사용할 수 있는 기능입니다.\n구독 플랜 구매는 사이트 상단의 'AI 구독권'에서 가능합니다.\n구독 플랜 페이지로 이동하시겠습니까?"
          }
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowSubscribeModal(false);
            router.push('/ai-subscribe');
          }}
          onCancel={() => setShowSubscribeModal(false)}
        />
      )}
    </>
  );
}
