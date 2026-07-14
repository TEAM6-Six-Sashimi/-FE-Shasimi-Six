'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FeatureHeader from '@/components/layout/FeatureHeader';
import ResumePageClient from '@/features/user/resume/components/ResumePageClient';
import SelfIntroPageClient from '@/features/user/self-introduction/components/SelfIntroPageClient';
import SelfIntroReviewDetail from '@/features/user/self-introduction/components/SelfIntroReviewDetail';
import { SavedResume } from '@/features/user/resume/types';
import { MySubscription } from '@/features/user/payments/types';
import {
  CoverLetterResponse,
  CoverLetterReviewDetail,
} from '@/features/user/self-introduction/types';

type AiAnalysisTab = 'resume' | 'self-intro';

const VALID_TABS: AiAnalysisTab[] = ['resume', 'self-intro'];

interface AiAnalysisPageClientProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedResume: SavedResume | null;
  savedCoverLetter: CoverLetterResponse | null;
  latestCoverLetterReview: CoverLetterReviewDetail | null;
  mySubscription: MySubscription | null;
  isLoggedIn: boolean;
}

export default function AiAnalysisPageClient({
  userName,
  userPhone,
  userEmail,
  savedResume,
  savedCoverLetter,
  latestCoverLetterReview,
  mySubscription,
  isLoggedIn,
}: AiAnalysisPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const reviewIdFromUrl = searchParams.get('reviewId');
  const reviewId = reviewIdFromUrl ? Number(reviewIdFromUrl) : null;
  const initialTab: AiAnalysisTab = VALID_TABS.includes(tabFromUrl as AiAnalysisTab)
    ? (tabFromUrl as AiAnalysisTab)
    : 'resume';

  const [tab, setTab] = useState<AiAnalysisTab>(initialTab);

  // URL의 tab 쿼리가 바뀌면(뒤로가기, 주소 직접 입력 등) 탭 상태도 동기화
  useEffect(() => {
    if (VALID_TABS.includes(tabFromUrl as AiAnalysisTab)) {
      setTab(tabFromUrl as AiAnalysisTab);
    } else {
      setTab('resume');
    }
  }, [tabFromUrl]);

  const handleTabChange = (next: AiAnalysisTab) => {
    setTab(next);
    if (next === 'resume') {
      router.replace('/ai-analysis', { scroll: false });
    } else {
      router.replace(`/ai-analysis?tab=${next}`, { scroll: false });
    }
  };

  const subscriptionText = mySubscription?.subscribed
    ? `${mySubscription.planName} / 갱신일 : ${mySubscription.expiresAt?.slice(0, 10)}`
    : '보유한 구독권이 없습니다.';

  return (
    <div className="bg-[#F9FAFB]">
      <FeatureHeader
        icon="ai"
        title="AI 이력서, 자기소개서 작성 & 평가"
        description="템플릿으로 이력서 및 자기소개서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다."
        right={subscriptionText}
        rightHighlight={!mySubscription?.subscribed}
      />
      <div className="min-h-screen">
        <div className="max-w-275 mx-auto py-6 px-6">
          {/* 탭 이력서/자기소개서 */}
          <div className="flex items-center border-b border-[#E5E7EB] mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('resume')}
              className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
                tab === 'resume'
                  ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                  : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
              }`}
            >
              이력서 작성
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('self-intro')}
              className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
                tab === 'self-intro'
                  ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                  : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
              }`}
            >
              자기소개서 작성
            </button>
          </div>

          {tab === 'resume' && (
            <ResumePageClient
              userName={userName}
              userPhone={userPhone}
              userEmail={userEmail}
              savedResume={savedResume}
              isLoggedIn={isLoggedIn}
            />
          )}

          {tab === 'self-intro' &&
            (reviewId !== null && !Number.isNaN(reviewId) ? (
              <SelfIntroReviewDetail reviewId={reviewId} />
            ) : (
              <SelfIntroPageClient
                userName={userName}
                userPhone={userPhone}
                userEmail={userEmail}
                savedCoverLetter={savedCoverLetter}
                latestCoverLetterReview={latestCoverLetterReview}
                isLoggedIn={isLoggedIn}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
