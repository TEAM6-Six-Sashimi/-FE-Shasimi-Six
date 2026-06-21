'use client'

export interface AgreementItem {
  key: 'privacy' | 'marketing' | 'emailNotice' | 'aiUsage';
  title: string;
  description: string;
  required: boolean;
}
 
export const AGREEMENT_ITEMS: AgreementItem[] = [
  {
    key: 'privacy',
    title: '개인정보 수집 및 이용 동의 (필수)',
    description: '서비스 제공을 위해 이름, 생년월일, 전화번호, 이메일, 아이디 등 개인정보를 수집 및 이용하는 것에 동의합니다.',
    required: true,
  },
  {
    key: 'marketing',
    title: '마케팅 수신 동의 (선택)',
    description: '사이트에서 제공하는 신규 강의 안내, 이벤트, 프로모션 등 마케팅 정보를 이메일로 수신하는 것에 동의합니다.',
    required: false,
  },
  {
    key: 'emailNotice',
    title: '이메일 수신 동의 (선택)',
    description: '학습 독려, D-day 알림, 미진행 강의 리마인드 등 사이트에서 제공하는 동기부여 및 학습 관련 알림 이메일을 수신하는 것에 동의합니다.',
    required: false,
  },
  {
    key: 'aiUsage',
    title: 'AI 기능 활용 동의 (선택)',
    description: 'AI 이력서 평가, 채용공고 기반 맞춤 강의 추천 등 AI 기능 제공을 위해 입력한 이력서 및 개인 학습 정보를 활용하는 것에 동의합니다.',
    required: false,
  },
];

export type AgreementState = Record<AgreementItem['key'], boolean>;

interface AgreementSectionProps {
  agreements: AgreementState;
  onToggle: (key: AgreementItem['key']) => void;
}

export default function AgreementSection({ agreements, onToggle }: AgreementSectionProps) {
    return (
        <div className="flex flex-col gap-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5">
          {AGREEMENT_ITEMS.map((item) => {
            const checked = agreements[item.key];
            return (
              <div key={item.key} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggle(item.key)}
                  className="flex items-center gap-2 cursor-pointer text-left"
                >
                  <span
                    className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border-[1.5px] transition-colors
                      ${checked ? 'bg-[#FF5E5E] border-[#FF5E5E]' : 'bg-white border-[#D1D5DB]'}`}
                  >
                    {checked && (
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4L4 7L10 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-[14px] font-semibold text-[#1E2125]">{item.title}</span>
                </button>
                <p className="text-[12px] text-[#6A7282] pl-7 leading-relaxed">
                  · {item.description}
                </p>
              </div>
            );
          })}
        </div>
    )
}