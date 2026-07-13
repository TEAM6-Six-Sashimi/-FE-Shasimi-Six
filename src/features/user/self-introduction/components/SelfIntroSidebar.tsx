'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function SelfIntroSidebar() {
  const [isEvaluating, setIsEvaluating] = useState(false);

  // TODO: 실제 AI 평가 API 연동 필요 - 지금은 레이아웃 확인용 임시 처리
  const handleEvaluate = () => {
    if (isEvaluating) return;
    setIsEvaluating(true);
    setTimeout(() => setIsEvaluating(false), 300);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3">
        <h2 className="flex items-center gap-1.5 text-[16px] font-bold text-[#1E2125]">
          <Image src="/ai-resume/ai-evaluation.svg" alt="ai 자기소개서 평가" width={18} height={18} />{' '}
          AI 자기소개서 평가
        </h2>

        <p className="text-[13px] text-[#6A7282] leading-relaxed">
          저장된 자기소개서를 AI가 분석하고 개선 방향을 제안해드립니다.
        </p>

        <Button
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full h-11 bg-[#5B8DEE] hover:bg-[#3B66B9] text-white font-semibold text-[14px] cursor-pointer disabled:opacity-60"
        >
          {isEvaluating ? '평가 중...' : 'AI 평가 시작'}
        </Button>
      </div>
    </div>
  );
}
