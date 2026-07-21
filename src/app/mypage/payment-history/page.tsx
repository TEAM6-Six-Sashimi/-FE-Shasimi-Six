import { cookies } from 'next/headers';
import {
  fetchCoursePaymentHistory,
  fetchSubscriptionPaymentHistory,
  fetchSubscriptionMe,
} from '@/services/payment.service';
import PaymentHistoryClient from './components/PaymentHistoryClient';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function PaymentHistoryPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  let coursePayments, subscriptionPayments, subscriptionMe;
  try {
    [coursePayments, subscriptionPayments, subscriptionMe] = await Promise.all([
      fetchCoursePaymentHistory(accessToken),
      fetchSubscriptionPaymentHistory(accessToken),
      fetchSubscriptionMe(accessToken),
    ]);
  } catch (e) {
    // 세션이 완전히 끊긴 경우 - 로그아웃 처리
    if (e instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={e.message} />;
    }
    throw e;
  }

  return (
    <PaymentHistoryClient
      coursePayments={coursePayments.items}
      subscriptionPayments={subscriptionPayments.items}
      subscriptionMe={subscriptionMe}
    />
  );
}
