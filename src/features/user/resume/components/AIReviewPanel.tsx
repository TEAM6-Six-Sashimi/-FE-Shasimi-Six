'use client';

import { useState } from 'react';
import { reviewResume } from '@/services/resume.service';
import type { ReviewResumeResponse } from '@/features/user/resume/types';

interface AIReviewPanelProps {
  resumeId: number | null;
}

export default function AIReviewPanel({ resumeId }: AIReviewPanelProps) {
  const [reviewing, setReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResumeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!resumeId) return;
    setError(null);
    setReviewing(true);
    try {
      const data = await reviewResume(resumeId);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'AI 평가 중 오류가 발생했습니다.');
    } finally {
      setReviewing(false);
    }
  };

  const disabled = !resumeId || reviewing;

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[18px]">✨</span>
        <h2 className="text-[16px] font-bold text-[#1E2125]">AI 이력서 평가</h2>
      </div>

      {/* 결과 없음: 안내 */}
      {!result && (
        <>
          <p className="text-[12.5px] text-[#6A7282] leading-relaxed mb-4">
            {resumeId
              ? '저장된 이력서를 AI가 분석하여 강점/약점과 개선 방향을 제안해드립니다.'
              : '먼저 이력서를 저장한 후 AI 평가를 시작할 수 있습니다.'}
          </p>

          {error && (
            <div className="mb-3 px-3 py-2 rounded-lg text-[12.5px] font-medium bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleReview}
            disabled={disabled}
            className={`w-full h-11 rounded-lg text-white font-semibold text-[14px] transition-all ${
              disabled
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#7C7DEC] hover:bg-[#5F60D9] cursor-pointer active:scale-[0.99]'
            }`}
          >
            {reviewing ? '평가 중...' : 'AI 평가 시작'}
          </button>
        </>
      )}

      {/* 결과 표시 */}
      {result && (
        <>
          {/* 점수 원 */}
          <div className="flex flex-col items-center mb-5">
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FFF0F0] to-[#F0F0FF] border-4 border-[#7C7DEC]">
              <div className="text-center">
                <p className="text-[28px] font-bold text-[#1E2125] leading-none">
                  {Math.round(result.overallScore)}
                </p>
                <p className="text-[11.5px] text-[#6A7282] mt-1">/ 100점</p>
              </div>
            </div>
            <p className="text-[13px] font-semibold text-[#1E2125] mt-2.5">종합 점수</p>
          </div>

          {/* 강점 */}
          <ReviewSection
            label="강점"
            color="green"
            text={result.strengths}
          />

          {/* 약점 */}
          <ReviewSection
            label="약점"
            color="orange"
            text={result.weaknesses}
          />

          {/* 개선 제안 */}
          <ReviewSection
            label="개선 제안"
            color="blue"
            text={result.suggestions}
          />

          <p className="text-[11px] text-[#9CA3AF] mt-3 text-right">
            평가일시: {new Date(result.evaluationAt).toLocaleString('ko-KR')}
          </p>

          <button
            type="button"
            onClick={handleReview}
            disabled={reviewing}
            className="w-full mt-4 h-10 rounded-lg border border-[#7C7DEC] text-[#7C7DEC] hover:bg-[#F5F5FF] font-semibold text-[13px] cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reviewing ? '재평가 중...' : '다시 평가하기'}
          </button>
        </>
      )}
    </aside>
  );
}

interface ReviewSectionProps {
  label: string;
  color: 'green' | 'orange' | 'blue';
  text: string;
}

function ReviewSection({ label, color, text }: ReviewSectionProps) {
  const colorMap = {
    green: { bg: 'bg-[#F0FDF4]', border: 'border-[#86EFAC]', label: 'text-[#15803D]' },
    orange: { bg: 'bg-[#FFF7ED]', border: 'border-[#FED7AA]', label: 'text-[#C2410C]' },
    blue: { bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', label: 'text-[#1D4ED8]' },
  }[color];

  return (
    <div className={`mb-3 px-3.5 py-3 rounded-lg border ${colorMap.bg} ${colorMap.border}`}>
      <p className={`text-[12.5px] font-bold mb-1.5 ${colorMap.label}`}>{label}</p>
      <p className="text-[12.5px] text-[#1E2125] leading-relaxed whitespace-pre-wrap">
        {text || '내용 없음'}
      </p>
    </div>
  );
}
