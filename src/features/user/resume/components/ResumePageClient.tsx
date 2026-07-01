'use client';

import { useState } from 'react';
import FeatureHeader from '@/components/layout/FeatureHeader';
import ResumeMain from './ResumeMain';
import ResumeSidebar from './ResumeSidebar';
import { SavedResume } from '../types';
import { MySubscription } from '../../payments/types';

interface ResumePageClientProps {
  userName: string;
  userPhone: string;
  userEmail: string;
  savedResume: SavedResume | null;
  mySubscription: MySubscription | null;
}

export default function ResumePageClient({
  userName,
  userPhone,
  userEmail,
  savedResume,
  mySubscription,
}: ResumePageClientProps) {
  const [isSaved, setIsSaved] = useState(!!savedResume);
  const [resumeId, setResumeId] = useState<number | null>(savedResume?.resumeId ?? null);

  const subscriptionText = mySubscription?.subscribed
    ? `${mySubscription.planName} / 갱신일 : ${mySubscription.expiresAt?.slice(0, 10)}`
    : '보유한 구독권이 없습니다.';

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
