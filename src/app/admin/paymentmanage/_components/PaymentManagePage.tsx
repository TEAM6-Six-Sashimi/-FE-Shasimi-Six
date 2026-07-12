'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CoursePayments from '@/features/admin/paymentmanage/components/CoursePayments';
import SubscriptionPayments from '@/features/admin/paymentmanage/components/SubscriptionPayments';

type Tab = 'courses' | 'subscriptions';

const VALID_TABS: Tab[] = ['courses', 'subscriptions'];

const TABS: { id: Tab; label: string }[] = [
  { id: 'courses', label: '강의 결제 내역' },
  { id: 'subscriptions', label: '구독권 결제 내역' },
];

export default function PaymentManagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab = VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'courses';

  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    setTab(VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'courses');
  }, [tabFromUrl]);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    if (next === 'courses') {
      router.replace('/admin/paymentmanage', { scroll: false });
    } else {
      router.replace(`/admin/paymentmanage?tab=${next}`, { scroll: false });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 결제 관리</h1>

      <div className="flex items-center border-b border-[#E5E7EB] mb-6">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
              tab === id
                ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'courses' && <CoursePayments />}
      {tab === 'subscriptions' && <SubscriptionPayments />}
    </div>
  );
}
