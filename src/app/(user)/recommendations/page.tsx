import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchMyResume } from '@/services/resume.service';
import { fetchMySubscriptionAction } from '@/features/user/payments/actions';
import RecommendationPageClient from '@/features/user/recommendations/components/RecommendationClientPage';

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

  const [savedResume, mySubscription] = await Promise.all([
    accessToken ? fetchMyResume(accessToken) : Promise.resolve(null),
    accessToken ? fetchMySubscriptionAction() : Promise.resolve(null),
  ]);

  return (
    <RecommendationPageClient
      resumeId={savedResume?.resumeId ?? null}
      mySubscription={mySubscription}
      isLoggedIn={!!accessToken}
    />
  );
}
