'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AiAgreementRequiredModal from '@/components/modals/AgreementRequiredModal';

// TODO: 실제 동의 여부는 user.agreements.aiUsage 등으로 교체 필요 (MypageMain의 MOCK_AGREEMENTS와 동일 출처)
const MOCK_AI_USAGE_AGREED = false;

interface PlanFeature {
  text: string;
}

interface Plan {
  id: 'monthly' | 'yearly';
  title: string;
  originalPrice?: string;
  price: string;
  unit: string;
  discountBadge?: string;
  features: PlanFeature[];
}

const PLANS: Plan[] = [
  {
    id: 'monthly',
    title: '1개월 플랜',
    price: '10,000',
    unit: '크레딧 / 월',
    features: [
      { text: 'AI 채용 공고 분석 기반 맞춤 강의 추천' },
      { text: 'AI 이력서 작성 및 평가' },
      { text: '기간 내 무제한 이용 가능' },
    ],
  },
  {
    id: 'yearly',
    title: '12개월 플랜',
    originalPrice: '120,000 크레딧',
    price: '100,000',
    unit: '크레딧 / 년',
    discountBadge: '약 17% 할인!',
    features: [
      { text: 'AI 채용 공고 분석 기반 맞춤 강의 추천' },
      { text: 'AI 이력서 작성 및 평가' },
      { text: '기간 내 무제한 이용 가능' },
      { text: '장기 이용 할인' },
    ],
  },
];

export default function AiSubscribePage() {
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);

  const handleStart = (planId: Plan['id']) => {
    if (!MOCK_AI_USAGE_AGREED) {
      setAgreementModalOpen(true);
      return;
    }
    // TODO: 실제 구독 시작 API 연결
    alert(`(준비 중) ${planId} 플랜 구독을 시작합니다.`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-16 px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-[32px] font-bold text-[#1E2125] mb-3">핏격 AI 플랜</h1>
        <p className="text-[15px] text-[#6A7282]">
          핏격의 AI 기능을 무제한으로 이용하고, 합격을 빠르게 앞당기세요!
        </p>
      </div>

      <div className="max-w-210 mx-auto grid grid-cols-2 gap-10">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-8 flex flex-col"
          >
            <h2 className="text-[18px] font-bold text-[#1E2125] mb-5">{plan.title}</h2>

            <div className="mb-6">
              {plan.originalPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px] text-[#9CA3AF] line-through">
                    {plan.originalPrice}
                  </span>
                  {plan.discountBadge && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFEBEB] text-[#FF5E5E]">
                      {plan.discountBadge}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-bold text-[#1E2125]">{plan.price}</span>
                <span className="text-[14px] text-[#6A7282]">{plan.unit}</span>
              </div>
            </div>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[13.5px] text-[#1E2125]">
                  <span className="text-[#A8D014] mt-0.5">✓</span>
                  {f.text}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleStart(plan.id)}
              className="w-full h-12 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[15px] cursor-pointer"
            >
              시작하기
            </Button>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-10 text-center">
        <p className="text-[12.5px] text-[#9CA3AF] leading-relaxed">
          구독 플랜 해지 시, 만료일까지 구독권이 유지됩니다. 구독 플랜 해지는 마이페이지 &gt;
          결제 내역(구독권)에서 가능합니다.
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