import { UserAgreements } from '../../types';

interface AgreementSectionProps {
  agreements: UserAgreements;
}

const AGREEMENT_ROWS: { key: keyof UserAgreements; label: string }[] = [
  { key: 'marketing', label: '마케팅 수신' },
  { key: 'emailNotice', label: '이메일 수신' },
  { key: 'aiUsage', label: 'AI 사용' },
];

export default function AgreementSection({ agreements }: AgreementSectionProps) {
  return (
    <div className="pt-5 mb-4 border-t border-[#E5E7EB]">
      <p className="text-[13px] text-[#9CA3AF] mb-3">동의 여부</p>
      <div className="flex flex-col col-span-1 gap-x-10">
        {/* 필수 항목 - 항상 동의 상태, 변경 불가 (하드코딩) */}
        <div className="flex items-center justify-between py-3.5 border-b border-[#F3F4F6]">
          <span className="text-[14px] text-[#6A7282] font-semibold">
            개인정보 수집 및 이용 (필수)
          </span>
          <span className="text-[13px] font-semibold text-[#FF5E5E]">동의</span>
        </div>

        {AGREEMENT_ROWS.map(({ key, label }, idx) => {
          const agreed = agreements[key];
          const isLast = idx === AGREEMENT_ROWS.length - 1;
          return (
            <div
              key={key}
              className={`flex items-center justify-between py-3.5 ${
                isLast ? '' : 'border-b border-[#F3F4F6]'
              }`}
            >
              <span className="text-[14px] text-[#6A7282] font-semibold">{label}</span>
              <span
                className={`text-[13px] font-semibold ${
                  agreed ? 'text-[#FF5E5E]' : 'text-[#9CA3AF]'
                }`}
              >
                {agreed ? '동의' : '미동의'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
