'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import FeatureHeader from '@/components/layout/FeatureHeader';
import { RecommendationInputType } from '@/features/user/recommendations/types';
import { analyzeJobPostingAction } from '@/features/user/recommendations/actions';


const TABS: { key: RecommendationInputType; label: string; icon: string }[] = [
  { key: 'URL', label: 'URL 입력', icon: '🔗' },
  { key: 'TEXT', label: '텍스트 직접 입력', icon: '📄' },
];

export default function RecommendationClient() {
  const [activeTab, setActiveTab] = useState<RecommendationInputType>('URL');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isInputFilled = activeTab === 'URL' ? !!url.trim() : !!text.trim();
  const isAnalyzeDisabled = !isInputFilled || isAnalyzing;

  const handleTabChange = (tab: RecommendationInputType) => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  const handleAnalyze = async () => {
    if (isAnalyzeDisabled) return;

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const result = await analyzeJobPostingAction(
        activeTab === 'URL'
          ? { inputType: 'URL', sourceUrl: url.trim() }
          : { inputType: 'TEXT', rawContent: text.trim() },
      );
      // TODO: 추천 결과 표시 UI 연동 (응답 스키마 확정 후)
      console.log('추천 결과:', result);
    } catch (error) {
      // Server Action을 거치면서 에러가 일반 Error로 직렬화되므로,
      // RecommendationApiError의 message(백엔드가 내려준 안내 문구)가 그대로 담겨 있음
      setErrorMessage(
        error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const tabButtonCls = (tab: RecommendationInputType) =>
    `flex items-center gap-1.5 pb-3 text-[14.5px] font-semibold border-b-2 transition-colors cursor-pointer ${
      activeTab === tab
        ? 'border-[#FF5E5E] text-[#FF5E5E]'
        : 'border-transparent text-[#9CA3AF] hover:text-[#6A7282]'
    }`;

  return (
    <div className="bg-[#F9FAFB]">
      <FeatureHeader
        icon="ai"
        title="AI 맞춤 강의 추천 (Beta)"
        description="채용공고를 등록하고 나에게 필요한 강의를 추천받아보세요."
        right="1개월 플랜 / 갱신일 : 2026-07-12" // TODO: 연동 필요
      />

      <div className="min-h-screen">
        <div className="max-w-275 mx-auto py-8 px-6">
          <div className="bg-white rounded-2xl shadow-md p-8">
            {/* 탭 */}
            <div className="flex items-center gap-8 border-b border-[#E5E7EB] mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={tabButtonCls(tab.key)}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* URL 입력 탭 */}
            {activeTab === 'URL' && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="채용공고 URL을 입력해 주세요."
                  className={`w-full h-12 px-4 rounded-xl border bg-white text-[14px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors ${
                    errorMessage ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
                  }`}
                />
                <p className="text-[12.5px] text-[#6A7282] leading-relaxed">
                  URL을 입력하면 자동으로 공고 내용을 불러옵니다.
                  <br />
                  (채용공고 중 여러 분야를 한번에 모집하는 경우 현재 모델에서는 지원되지 않습니다.
                  입력할 때 참고 부탁드립니다.)
                </p>
              </div>
            )}

            {/* 텍스트 직접 입력 탭 */}
            {activeTab === 'TEXT' && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    '채용공고 내용을 첨부해주세요.\n(채용공고 중 여러 분야를 한번에 모집하는 경우 현재 모델에서는 지원되지 않습니다. 입력할 때 참고 부탁드립니다.)\n직무, 주요 업무, 필수 사항, 우대 사항 내용이 필수로 포함되어야 합니다.'
                  }
                  rows={8}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-[14px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors resize-none ${
                    errorMessage ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
                  }`}
                />
              </div>
            )}

            {errorMessage && (
              <p className="text-[12.5px] text-[#FF5E5E] mt-3">⚠ {errorMessage}</p>
            )}

            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className={`w-full h-12 mt-6 rounded-xl font-semibold text-[15px] transition-colors ${
                isAnalyzeDisabled
                  ? 'bg-[#FF5E5E]/40 text-white cursor-not-allowed hover:bg-[#FF5E5E]/40'
                  : 'bg-[#FF5E5E] text-white hover:bg-[#D14848] cursor-pointer'
              }`}
            >
              {isAnalyzing ? '분석 중입니다...' : '분석하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}