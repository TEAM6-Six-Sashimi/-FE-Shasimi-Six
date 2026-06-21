interface SignupIndicatorProps {
  currentStep: number;
  steps: { label: string }[];
}

export default function SignupIndicator({ currentStep, steps }: SignupIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={stepNum} className="flex items-center">
            {/* 스텝 원 + 라벨 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold transition-colors ${
                  isDone
                    ? 'bg-[#CFEE5D] text-[#1E2125]'
                    : isActive
                      ? 'bg-[#FF5E5E] text-white'
                      : 'bg-[#E5E7EB] text-[#6A7282]'
                }`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              <span
                className={`text-[12.5px] font-medium ${
                  isActive ? 'text-[#FF5E5E]' : isDone ? 'text-[#1E2125]' : 'text-[#6A7282]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* 연결선 */}
            {idx < steps.length - 1 && <div className="w-24 h-0.5 mx-2 mb-5 bg-[#E5E7EB]" />}
          </div>
        );
      })}
    </div>
  );
}
