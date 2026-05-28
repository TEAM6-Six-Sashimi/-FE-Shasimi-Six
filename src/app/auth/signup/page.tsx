'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignupIndicator from "@/features/auth/components/signupform/SignupIndicator";
import Signup01Introduction from "@/features/auth/components/signupform/Signup01Introduction";
import Signup02Interests from "@/features/auth/components/signupform/Signup02Interests";
import { registerUser, SignupPayloadDto } from "@/services/auth.service";

const STEPS = [
    { id: 1, label: "회원정보 입력"},
    { id: 2, label: "관심 카테고리"}
];

interface SignupFormData {
    name: string;
    birth_date: string;
    phone: string;
    email: string;
    login_id: string;
    password: string;
    passwordConfirm: string;
}

interface SignupStatusData {
    email_verified: boolean;
    isIdChecked: boolean;
    isIdAvailable: boolean;
    isVerificationSent: boolean;
}

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        phone: '',
        email: '',
        login_id: '',
        password: '',
        passwordConfirm: ''
    });

    const [statusData, setStatusData] = useState({
        email_verified: false,
        isIdChecked: false,
        isIdAvailable: false,
        isVerificationSent: false
    });

    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [referralCode, setReferralCode] = useState<string>('');
    const [isReferralChecked, setIsReferralChecked] = useState<boolean>(false);

    const nextStep = (updatedForm: typeof formData, updatedStatus: typeof statusData) => {
        setFormData(updatedForm);
        setStatusData(updatedStatus);
        setStep((prev) => prev + 1);
    };

    const prevStep = (updatedCategories: number[], updatedReferral: string, updatedReferralChecked: boolean) => {
        setSelectedCategories(updatedCategories);
        setReferralCode(updatedReferral);
        setIsReferralChecked(updatedReferralChecked);
        setStep((prev) => prev - 1);
    };

    // 회원가입 제출 버튼
    const handleSignupSubmit = async (finalCategoryIds: number[], finalReferralCode: string) => {
        const finalPayload: SignupPayloadDto = {
            loginId: formData.login_id,
            password: formData.password,
            passwordConfirm: formData.passwordConfirm,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            birthDate: formData.birth_date,
            interestCategoryIds: finalCategoryIds,
            referralCode: finalReferralCode || null
        };
        
        console.log("백엔드로 보낼 최종 데이터:", finalPayload);

        try {
            const success = await registerUser(finalPayload);
            if (success) {
                alert("🎉 회원가입이 성공적으로 완료되었습니다!");
                router.push("/auth/login"); // 가입 완료 리다이렉트
            } else {
                alert("❌ 회원가입 실패: 서버 검증 에러 또는 데이터 처리에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원가입 요청 중 예외 발생:", error);
            alert("서버 통신 중 장애가 발생했습니다.");
        }
    }

    return (
        <div className="flex flex-col items-center w-full min-h-[calc(100vh-48px)] py-10 px-4 bg-[#F9FAFB]">
            <SignupIndicator currentStep={step} steps={STEPS}/>
            <div className="bg-white w-full max-w-xl rounded-2xl p-10 shadow-md">
                <div className="text-[29px] font-bold text-center mb-8">회원가입</div>
                {step === 1 && (
                    <Signup01Introduction 
                        initialFormData={formData}
                        initialStatusData={statusData}
                        onNext={nextStep} />
                )}
                {step === 2 && (
                    <Signup02Interests 
                        initialCategories={selectedCategories}
                        initialReferralCode={referralCode}
                        initialReferralChecked={isReferralChecked}
                        onPrev={prevStep} 
                        onSubmit={handleSignupSubmit}/>
                )}
            </div>
        </div>
    );
}