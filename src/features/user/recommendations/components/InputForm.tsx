'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OneButtonModal from '@/components/modals/OneButtonModal';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import { logoutAction } from '@/features/auth/actions';
import { LatestJobPostingRecommendation, RecommendationInputType } from '../types';
import { analyzeJobPostingAction, validateUrlAction } from '../actions';

const TABS: {
  key: RecommendationInputType;
  label: string;
  iconActive: string;
  iconInactive: string;
}[] = [
  {
    key: 'URL',
    label: 'URL 입력',
    iconActive: '/ai-recommendation/url-active.svg',
    iconInactive: '/ai-recommendation/url-inactive.svg',
  },
  {
    key: 'TEXT',
    label: '텍스트 직접 입력',
    iconActive: '/ai-recommendation/text-active.svg',
    iconInactive: '/ai-recommendation/text-inactive.svg',
  },
];

interface InputFormProps {
  resumeId: number | null;
  hasSubscription: boolean;
  isLoggedIn: boolean;
  latestRecommendation: LatestJobPostingRecommendation | null;
  onAnalyzeSuccess: (recommendationId: number) => void;
  onSelectHistory: (recommendationId: number) => void;
}

export default function InputForm({
  resumeId,
  hasSubscription,
  isLoggedIn,
  latestRecommendation,
  onAnalyzeSuccess,
  onSelectHistory,
}: InputFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<RecommendationInputType>('URL');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showInvalidUrlModal, setShowInvalidUrlModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    if (latestRecommendation) setShowHistory(true);
  };

  const handleInputBlur = () => {
    // 드롭다운 항목 클릭 이벤트가 먼저 처리되도록 약간의 지연 후 닫기
    blurTimeoutRef.current = setTimeout(() => setShowHistory(false), 150);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setShowHistory(false);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    setShowHistory(false);
  };

  const handleSelectHistory = () => {
    if (!latestRecommendation) return;
    setShowHistory(false);
    onSelectHistory(latestRecommendation.recommendationId);
  };

  const isInputFilled = activeTab === 'URL' ? !!url.trim() : !!text.trim();
  const isAnalyzeDisabled = !isInputFilled || isAnalyzing;

  const handleTabChange = (tab: RecommendationInputType) => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  const handleAnalyze = async () => {
    if (isAnalyzeDisabled) return;

    // 1. 로그인 여부 우선 확인
    if (!isLoggedIn) {
      setShowLoginRequiredModal(true);
      return;
    }

    // 2. 구독권 보유 여부 확인
    if (!hasSubscription) {
      setShowSubscribeModal(true);
      return;
    }

    // 3. URL 탭이면 접속 가능 여부 확인
    if (activeTab === 'URL') {
      const { valid } = await validateUrlAction(url.trim());
      if (!valid) {
        setShowInvalidUrlModal(true);
        return;
      }
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    const requestBody = {
      resumeId: resumeId ?? undefined,
      inputType: activeTab,
      sourceUrl: activeTab === 'URL' ? url.trim() : null,
      rawContent: activeTab === 'TEXT' ? text.trim() : null,
    };

    try {
      const result = await analyzeJobPostingAction(requestBody);

      if (result.success) {
        onAnalyzeSuccess(result.data.recommendationId);
      } else if (result.error.authError) {
        showToast(result.error.message, 'alarm');
        await logoutAction();
        return;
      } else {
        setErrorMessage(result.error.message);
      }
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
    <>
      <div className="bg-white rounded-2xl shadow-md p-8">
        {/* 탭 */}
        <div className="flex items-center gap-8 border-b border-[#E5E7EB] mb-6">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={tabButtonCls(tab.key)}
              >
                <span className="relative flex items-center shrink-0 w-4.5 h-4.5">
                  <Image
                    src={isActive ? tab.iconActive : tab.iconInactive}
                    alt=""
                    width={18}
                    height={18}
                  />
                </span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* URL 입력 탭 */}
        {activeTab === 'URL' && (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="채용공고 URL을 입력해 주세요."
                className={`w-full h-12 px-4 rounded-xl border bg-white text-[14px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors ${
                  errorMessage ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
                }`}
              />
              {showHistory && latestRecommendation && (
                <HistoryDropdown
                  recommendation={latestRecommendation}
                  onSelect={handleSelectHistory}
                />
              )}
            </div>
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
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={
                  '채용공고 내용을 첨부해주세요.\n(채용공고 중 여러 분야를 한번에 모집하는 경우 현재 모델에서는 지원되지 않습니다. 입력할 때 참고 부탁드립니다.)\n직무, 주요 업무, 필수 사항, 우대 사항 내용이 필수로 포함되어야 합니다.'
                }
                rows={8}
                className={`w-full px-4 py-3 rounded-xl border bg-white text-[14px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors resize-none ${
                  errorMessage ? 'border-[#FF5E5E]' : 'border-[#D1D5DB]'
                }`}
              />
              {showHistory && latestRecommendation && (
                <HistoryDropdown
                  recommendation={latestRecommendation}
                  onSelect={handleSelectHistory}
                />
              )}
            </div>
          </div>
        )}

        {errorMessage && <p className="text-[12.5px] text-[#FF5E5E] mt-3">⚠ {errorMessage}</p>}

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

      {/* URL이 접속 불가능한 경우 */}
      {showInvalidUrlModal && (
        <OneButtonModal
          title="알림"
          message="입력하신 URL에 접속할 수 없습니다. URL을 다시 확인해주세요."
          onConfirm={() => setShowInvalidUrlModal(false)}
        />
      )}

      {/* 로그인 필요 모달 */}
      {showLoginRequiredModal && (
        <TwoButtonModal
          title="로그인이 필요합니다"
          message={`로그인 후 이용할 수 있는 기능입니다.\n로그인 페이지로 이동하시겠습니까?`}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setShowLoginRequiredModal(false);
            router.push('/auth/login');
          }}
          onCancel={() => setShowLoginRequiredModal(false)}
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

function HistoryDropdown({
  recommendation,
  onSelect,
}: {
  recommendation: LatestJobPostingRecommendation;
  onSelect: () => void;
}) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-2 z-10">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onSelect}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F9FAFB] transition-colors cursor-pointer"
      >
        <History className="w-4 h-4 text-[#9CA3AF] shrink-0" />
        <span className="flex-1 min-w-0 text-[13.5px] text-[#1E2125] truncate">
          {recommendation.summary?.jobRole ?? '최근 분석한 채용공고'}
        </span>
      </button>
    </div>
  );
}
