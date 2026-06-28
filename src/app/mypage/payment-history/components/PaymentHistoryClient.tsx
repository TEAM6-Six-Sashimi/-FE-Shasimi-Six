'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CoursePaymentItem, SubscriptionMeResponse, SubscriptionPaymentItem } from '@/features/mypage/types';
import CoursePaymentTable from '@/features/mypage/components/payment-history/CoursePaymentTable';
import SubscriptionPaymentTable from '@/features/mypage/components/payment-history/SubscriptionPaymentTable';


type Tab = 'course' | 'subscription';
const VALID_TABS: Tab[] = ['course', 'subscription'];

interface PaymentHistoryClientProps {
  coursePayments: CoursePaymentItem[];
  subscriptionPayments: SubscriptionPaymentItem[];
  subscriptionMe: SubscriptionMeResponse | null;
}

export default function PaymentHistoryClient({
  coursePayments,
  subscriptionPayments,
  subscriptionMe,
}: PaymentHistoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab = VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'course';

  const [tab, setTab] = useState<Tab>(initialTab);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    if (next === 'course') {
      router.replace('/mypage/payment-history', { scroll: false });
    } else {
      router.replace(`/mypage/payment-history?tab=${next}`, { scroll: false });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">결제 내역</h1>

      <div className="flex items-center border-b border-[#E5E7EB] mb-6">
        <button
          onClick={() => handleTabChange('course')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
            tab === 'course'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          강의 결제 내역
        </button>
        <button
          onClick={() => handleTabChange('subscription')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
            tab === 'subscription'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          구독 플랜 결제 내역
        </button>
      </div>

      {tab === 'course' && <CoursePaymentTable items={coursePayments} />}
      {tab === 'subscription' && (
        <SubscriptionPaymentTable items={subscriptionPayments} subscriptionMe={subscriptionMe} />
      )}
    </div>
  );
}