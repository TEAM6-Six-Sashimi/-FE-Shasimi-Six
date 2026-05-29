'use client'

import Content from "@/features/user/credit/components/Content";
import Sticky from "@/features/user/credit/components/Sticky";
import { useState } from "react";

export default function CreditPage() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');

    const currentCredit = 12500;   // 하드코딩

    const chargeAmount = selectedAmount ?? (parseInt(customAmount.replace(/,/g,'')) || 0);
    const afterCredit = currentCredit + chargeAmount;

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
                    />
                </div>
            </div>
        </div>
    );
}