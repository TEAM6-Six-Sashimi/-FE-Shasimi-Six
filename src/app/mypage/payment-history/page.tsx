import { cookies } from 'next/headers';
import {
  fetchCoursePaymentHistory,
  fetchSubscriptionPaymentHistory,
  fetchSubscriptionMe,
} from '@/services/payment.service';
import PaymentHistoryClient from './components/PaymentHistoryClient';

export default async function PaymentHistoryPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  const [coursePayments, subscriptionPayments, subscriptionMe] = await Promise.all([
    fetchCoursePaymentHistory(accessToken),
    fetchSubscriptionPaymentHistory(accessToken),
    fetchSubscriptionMe(accessToken),
  ]);

  return (
    <PaymentHistoryClient
      coursePayments={coursePayments.items}
      subscriptionPayments={subscriptionPayments.items}
      subscriptionMe={subscriptionMe}
    />
  );
}