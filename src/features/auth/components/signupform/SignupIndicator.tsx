interface SignupIndicatorProps {
    currentStep: number;
}

export default function SignupIndicator({ currentStep }: SignupIndicatorProps) {
    
    const steps = [
        { id: 1, label: "회원정보 입력"},
        { id: 2, label: "관심 카테고리"}
    ];
    
    return (
        <div className="w-full max-w-lg">
            <div className="flex justify-center items-center relative">
                {steps.map((step, index) => {
                    const isActive = currentStep >= step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    isCurrent || isActive 
                                        ? "bg-[#FF5F5F] text-white" 
                                        : "bg-[#E5E7EB] text-[#6A7282]"
                                }`}
                            >
                                {step.id}
                            </div>

                            <span
                                className={`text-xs sm:text-sm mt-2 font-medium transition-all duration-300
                                    ${isActive ? "text-[#FF5F5F]" : "text-gray-400"}`}>
                                {step.label}
                            </span>        
                        </div>
                    )
                })}
            </div>
        </div>
    );
}