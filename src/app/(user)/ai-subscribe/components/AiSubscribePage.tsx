'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AiAgreementRequiredModal from '@/components/modals/AgreementRequiredModal';
import { useToast } from '@/components/ui/ToastContext';
import { MySubscription, SubscriptionPlan } from '@/features/user/payments/types';

interface Props {
  plans: SubscriptionPlan[];
  mySubscription: MySubscription | null;
  aiConsent: boolean; // ai 동의 여부
}

export default function AiSubscribePage({ plans, mySubscription, aiConsent }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);

  const handleStart = (planCode: string) => {
    if (mySubscription?.subscribed) {
      showToast('이미 이용 중인 구독 플랜이 있습니다.', 'negative');
      return;
    }
    if (!aiConsent) {
      setAgreementModalOpen(true);
      return;
    }
    router.push(`/payments?type=subscription&planCode=${planCode}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#1E2125] mb-3">핏격 AI 플랜</h1>
        <p className="text-[15px] text-[#6A7282]">
          핏격의 AI 기능을 무제한으로 이용하고, 합격을 빠르게 앞당기세요!
        </p>
        {mySubscription?.subscribed && (
          <p className="text-[13px] text-[#FF5E5E] font-semibold mt-3">
            현재 {mySubscription.planName} 이용 중 ({mySubscription.expiresAt.slice(0, 10)}까지)
          </p>
        )}
      </div>

      <div className="max-w-210 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10">
        {plans.map((plan) => {
          const hasDiscount = plan.discountRate > 0;
          return (
            <div
              key={plan.planCode}
              className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8 flex flex-col"
            >
              <h2 className="text-[18px] font-bold text-[#1E2125] mb-5">{plan.planName}</h2>

              <div className="mb-6">
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] text-[#9CA3AF] line-through">
                      {plan.originalPrice.toLocaleString()} 크레딧
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFEBEB] text-[#FF5E5E]">
                      약 {plan.discountRate}% 할인!
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold text-[#1E2125]">
                    {plan.price.toLocaleString()}
                  </span>
                  <span className="text-[14px] text-[#6A7282]">
                    크레딧 / {plan.durationMonths === 1 ? '월' : '년'}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[13.5px] text-[#1E2125]">
                    <span className="text-[#A8D014] mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleStart(plan.planCode)}
                className="w-full h-12 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[15px] cursor-pointer"
              >
                구매하기
              </Button>
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto mt-10 text-center">
        <p className="text-[12.5px] text-[#9CA3AF] leading-relaxed">
          구독 플랜 해지 시, 만료일까지 구독권이 유지됩니다. 구독 플랜 해지는 마이페이지 &gt; 결제
          내역(구독권)에서 가능합니다.
          <br />
          크레딧이 부족할 경우, 자동 갱신 없이 구독권이 해지됩니다.
        </p>
      </div>

      {agreementModalOpen && (
        <AiAgreementRequiredModal onCancel={() => setAgreementModalOpen(false)} />
      )}
    </div>
  );
}
