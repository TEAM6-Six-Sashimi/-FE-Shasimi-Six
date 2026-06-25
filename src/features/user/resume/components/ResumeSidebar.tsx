'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ResumeSidebar() {
  //   이력서 평가부 상태
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setEvaluationResult(null);
    // TODO: evaluateResumeAction() 연결 - 응답 받으면 setEvaluationResult(...), setIsEvaluating(false)
  };

  return (
    <div className="w-80 shrink-0">
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3">
        <h2 className="flex items-center gap-1.5 text-[16px] font-bold text-[#1E2125]">
          <Image src="/ai-resume/ai-evaluation.svg" alt="ai 이력서 평가" width={18} height={18} /> AI 이력서 평가
        </h2>
        <p className="text-[13px] text-[#6A7282] leading-relaxed">
          저장된 이력서를 AI가 분석하고 개선 방향을 제안해드립니다.
        </p>

        <Button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full h-11 bg-[#5B8DEE] hover:bg-[#3B66B9] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-60"
        >
          {isEvaluating ? '평가 중...' : 'AI 평가 시작'}
        </Button>

        {/* 평가 결과 표시 영역 - 추후 API 연동 시 evaluationResult를 렌더링 */}
        {evaluationResult && (
          <div className="mt-2 p-3 bg-[#F9FAFB] rounded-lg text-[12.5px] text-[#1E2125] whitespace-pre-line">
            {evaluationResult}
          </div>
        )}
      </div>
    </div>
  );
}
