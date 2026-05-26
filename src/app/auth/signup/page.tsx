'use client'

import { useState } from "react";
import SignupIndicator from "@/features/auth/components/signupform/SignupIndicator";
import Signup01Introduction from "@/features/auth/components/signupform/Signup01Introduction";
import Signup02Interests from "@/features/auth/components/signupform/Signup02Interests";

export default function SignupPage() {

    const [step, setStep] = useState<number>(1);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    // 회원가입 제출 버튼
    const handleSignupSubmit = () => {
        alert("회원가입 제출 완료");
    }

    return (
        <div className="flex flex-col justify-between items-center w-full min-h-[calc(100vh-48px)] py-16 px-4 bg-[#F9FAFB]">
            <SignupIndicator />
            <div className="bg-white w-full max-w-lg rounded-2xl p-10 shadow-md">
                <div className="text-[29px] font-bold text-center">회원가입</div>
                {step === 1 && (
                    <Signup01Introduction onNext={nextStep} />
                )}
                {step === 2 && (
                    <Signup02Interests onPrev={prevStep} onSubmit={handleSignupSubmit} />
                )}
            </div>
        </div>
    );
}