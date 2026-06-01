'use client';

import { useState } from 'react';
import Content from '@/features/user/credit/components/Content';
import Sticky from '@/features/user/credit/components/Sticky';

interface CreditClientProps {
  initialCredit: number;
}

export default function CreditClient({ initialCredit }: CreditClientProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currentCredit, setCurrentCredit] = useState<number>(initialCredit);

  const chargeAmount = selectedAmount ?? (parseInt(customAmount.replace(/,/g, '')) || 0);
  const afterCredit = currentCredit + chargeAmount;

  // 충전 완료 후 잔액 갱신 + 입력값 초기화
  const handleChargeSuccess = (newBalance: number) => {
    setCurrentCredit(newBalance);
    setSelectedAmount(null);
    setCustomAmount('');
  };

  return (
    <div className="flex gap-6 bg-[#F9FAFB] items-start mx-auto py-10 px-4">
      <div className="flex max-w-275 mx-auto gap-5">
        <div className="flex-1 bg-white rounded-2xl p-8 shadow-md mb-20">
          <Content
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
          />
        </div>
        <div className="w-72 shrink-0 sticky top-4">
          <Sticky
            currentCredit={currentCredit}
            chargeAmount={chargeAmount}
            afterCredit={afterCredit}
            onChargeSuccess={handleChargeSuccess}
          />
        </div>
      </div>
    </div>
  );
}
