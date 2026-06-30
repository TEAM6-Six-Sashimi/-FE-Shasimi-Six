import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchSubscriptionPlansAction, fetchMySubscriptionAction } from '@/features/user/payments/actions';
import AiSubscribePage from './components/AiSubscribePage';

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  console.log('accessToken:', accessToken); // undefined면 비로그인 상태

  const [plans, mySubscription, user] = await Promise.all([
    fetchSubscriptionPlansAction(),
    fetchMySubscriptionAction(),
    accessToken ? fetchUserMe(accessToken) : Promise.resolve(null),
  ]);

  console.log('plans:', plans);           // [] 이면 API 호출 실패
  console.log('plans 길이:', plans.length);

  const aiConsent = user?.aiConsent ?? false;

  return <AiSubscribePage plans={plans} mySubscription={mySubscription} aiConsent={aiConsent} />;
}