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

  const chargeAmount = selectedAmount ?? (parseInt(customAmount.replace(/,/g, '')) || 0);
  const afterCredit = initialCredit + chargeAmount;

  return (
    <div className="flex gap-6 bg-[#F9FAFB] items-start mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 max-w-275 mx-auto w-full items-start">
        <div className="bg-white rounded-2xl p-8 shadow-md gap-10">
          <Content
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
          />
        </div>
        <div className="sticky top-4">
          <Sticky
            currentCredit={initialCredit}
            chargeAmount={chargeAmount}
            afterCredit={afterCredit}
          />
        </div>
      </div>
    </div>
  );
}
