import { cookies } from 'next/headers';
import { fetchMyResume } from '@/services/resume.service'; 
import { fetchMySubscriptionAction } from '@/features/user/payments/actions';
import RecommendationPageClient from '@/features/user/recommendations/components/RecommendationClientPage';

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
    />
  );
}
 