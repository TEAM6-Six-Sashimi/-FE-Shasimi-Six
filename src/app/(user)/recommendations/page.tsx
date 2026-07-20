import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchMyResume } from '@/services/resume.service';
import { fetchMySubscriptionAction } from '@/features/user/payments/actions';
import { fetchLatestJobPostingRecommendationAction } from '@/features/user/recommendations/actions';
import RecommendationPageClient from '@/features/user/recommendations/components/RecommendationClientPage';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export const metadata: Metadata = {
  title: 'AI 맞춤 강의 추천',
  description: '채용공고를 등록하고 나에게 필요한 강의를 추천받아보세요.',
  openGraph: {
    title: 'AI 맞춤 강의 추천 | 핏(Fit)-격',
    description: '채용공고를 등록하고 나에게 필요한 강의를 추천받아보세요.',
    url: '/recommendations',
  },
};

export default async function RecommendationsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let savedResume, mySubscription, latestRecommendation;
  try {
    [savedResume, mySubscription, latestRecommendation] = await Promise.all([
      accessToken ? fetchMyResume(accessToken) : Promise.resolve(null),
      accessToken ? fetchMySubscriptionAction() : Promise.resolve(null),
      accessToken ? fetchLatestJobPostingRecommendationAction() : Promise.resolve(null),
    ]);
  } catch (e) {
    // 동시 접속 등으로 세션이 완전히 끊긴 경우 - 로그아웃 처리
    if (e instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={e.message} />;
    }
    throw e;
  }

  return (
    <RecommendationPageClient
      resumeId={savedResume?.resumeId ?? null}
      mySubscription={mySubscription}
      latestRecommendation={latestRecommendation}
      isLoggedIn={!!accessToken}
    />
  );
}
