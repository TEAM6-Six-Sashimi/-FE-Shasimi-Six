'use client';

import { useState, useEffect } from 'react';
import FeatureHeader from '@/components/layout/FeatureHeader';
import ResumeMain from './ResumeMain';
import ResumeSidebar from './ResumeSidebar';
import { fetchSubscriptionPlan, SavedResume } from '@/services/ai.service';
import { SubscriptionPlanResponse } from '../types';

interface ResumePageClientProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedResume: SavedResume | null;
}

export default function ResumePageClient({
  userName,
  userPhone,
  userEmail,
  savedResume,
}: ResumePageClientProps) {
  const [isSaved, setIsSaved] = useState(!!savedResume);
  const [resumeId, setResumeId] = useState<number | null>(savedResume?.resumeId ?? null);

  const [subscription, setSubscription] =
  useState<SubscriptionPlanResponse | null>(null);
  const [subscriptionText, setSubscriptionText] = useState('');

  useEffect(() => {
  const loadSubscription = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setSubscriptionText('보유한 구독권이 없습니다.');
      return;
    }

    const result = await fetchSubscriptionPlan(accessToken);

    if (!result || !result.subscribed) {
      setSubscription(result);
      setSubscriptionText('보유한 구독권이 없습니다.');
      return;
    }

    setSubscription(result);

    const renewDate = result.nextBillingAt
      ? result.nextBillingAt.split('T')[0]
      : '-';

    setSubscriptionText(
      `${result.planName} / 갱신일 : ${renewDate}`,
    );
  };

  loadSubscription();
}, []);

  return (
    <div className="bg-[#F9FAFB]">
      <FeatureHeader
        icon="ai"
        title="AI 이력서 작성 & 평가"
        description="템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다."
        right={subscriptionText}
      />
      <div className="min-h-screen ">
        <div className="max-w-275 mx-auto py-6 px-6">
          <div className="flex gap-10 items-start">
            <div className="flex-1 min-w-0">
              <ResumeMain
                userName={userName}
                userPhone={userPhone}
                userEmail={userEmail}
                savedResume={savedResume}
                onSavedStateChange={(saved, id) => {
                  setIsSaved(saved);
                  setResumeId(id);
                }}
              />
            </div>
            <div className="w-72 shrink-0 sticky top-4">
              <ResumeSidebar isSaved={isSaved} resumeId={resumeId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}