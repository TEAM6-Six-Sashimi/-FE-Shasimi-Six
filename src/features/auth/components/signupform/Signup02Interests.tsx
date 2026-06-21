'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categories.service';
import { checkReferralCode } from '@/services/auth.service';
import { Category } from '@/features/categories/types';
import { Button } from '@/components/ui/button';

interface InterestsProps {
  initialCategories: number[];
  initialReferralCode: string;
  initialReferralChecked: boolean;
  onPrev: (selectedCategories: number[], referral_code: string, isReferralChecked: boolean) => void;
  onSubmit: (selectedCategories: number[], referral_code: string) => void;
}

// 약관 동의 항목
interface AgreementItem {
  key: 'privacy' | 'marketing' | 'emailNotice' | 'aiUsage';
  title: string;
  description: string;
  required: boolean;
}
 
const AGREEMENT_ITEMS: AgreementItem[] = [
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

type AgreementState = Record<AgreementItem['key'], boolean>;

export default function Signup02Interests({
  initialCategories,
  initialReferralCode,
  initialReferralChecked,
  onPrev,
  onSubmit,
}: InterestsProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(initialCategories);
  const [referral_code, setReferralCode] = useState<string>(initialReferralCode);
  const [isReferralChecked, setIsReferralChecked] = useState<boolean>(initialReferralChecked);
  const [referralMessage, setReferralMessage] = useState<string>(
    initialReferralChecked ? '유효한 추천인 코드입니다! ✅' : '',
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 약관 동의 상태
  const [agreements, setAgreements] = useState<AgreementState>({
    privacy: false,
    marketing: false,
    emailNotice: false,
    aiUsage: false,
  });

  const inputCls =
    'w-full h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        // 카테고리 로드 실패 시, 빈 목록
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleCategoryToggle = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAgreementToggle = (key: AgreementItem['key']) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReferralCheck = async () => {
    if (!referral_code) {
      setReferralMessage('추천인 코드를 입력해주세요.');
      return;
    }
    try {
      const isValid = await checkReferralCode(referral_code);
      if (isValid) {
        setIsReferralChecked(true);
        setReferralMessage('유효한 추천인 코드입니다! ✅');
      } else {
        setIsReferralChecked(false);
        setReferralMessage('존재하지 않는 추천인 코드입니다. ❌');
      }
    } catch (error) {
      setReferralMessage('추천인 확인 중 에러가 발생했습니다.');
    }
  };

  const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralCode(e.target.value);
    setIsReferralChecked(false);
    setReferralMessage('');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (referral_code && !isReferralChecked) {
      setReferralMessage('추천인 코드 확인을 완료해 주세요.');
      return;
    }

    onSubmit(selectedCategoryIds, referral_code);
  };

  const isSubmitEnabled = agreements.privacy;

  if (isLoading)
    return <div className="text-center py-10 text-sm text-gray-500">카테고리를 불러오는 중...</div>;

  return (
    <form onSubmit={handleFinalSubmit} >
      <div>
        <label className="block text-[14px] font-bold text-[#1E2125] mb-3">
          관심 자격증 카테고리를 선택해 주세요 (중복 선택 가능)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategoryIds.includes(cat.mainCategoryId);
            return (
              <Button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryToggle(cat.mainCategoryId)}
                className={`py-2.5 px-4 h-auto rounded-full text-[15px] font-semibold border-[1.5px] transition-all duration-100 cursor-pointer ${
                  isSelected
                    ? 'bg-[#F9FBE7] text-[#827717] border-transparent hover:bg-[#F9FBE7] hover:text-[#827717]'
                    : 'bg-white text-[#6A7282] border-[#D1D5DB] hover:bg-gray-50 hover:text-[#6A7282]'
                }`}
              >
                {cat.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="pt-6">
        <label className="block text-[14px] font-bold text-[#1E2125] mb-1.5">
          추천인 코드 (선택)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referral_code}
            onChange={handleReferralChange}
            placeholder="추천인 코드를 입력해주세요"
            className={inputCls}
            disabled={isReferralChecked}
          />
          <Button
            type="button"
            onClick={handleReferralCheck}
            disabled={isReferralChecked}
            className={`px-4 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 cursor-pointer ${
              isReferralChecked
                ? 'bg-[#FFEBEB] text-[#FF5F5F] hover:bg-[#FFEBEB] cursor-not-allowed'
                : 'bg-[#FF5F5F] text-white hover:bg-[#D14848]'
            }`}
          >
            {isReferralChecked ? '확인 완료' : '추천인 확인'}
          </Button>
        </div>
        {referralMessage && (
          <p
            className={`text-xs mt-1 font-medium ${isReferralChecked ? 'text-green-600' : 'text-red-500'}`}
          >
            {referralMessage}
          </p>
        )}
      </div>

      {/* 약관 동의 */}
      <div className="pt-6">
        <div className="flex flex-col gap-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5">
          {AGREEMENT_ITEMS.map((item) => {
            const checked = agreements[item.key];
            return (
              <div key={item.key} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAgreementToggle(item.key)}
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
      </div>

      <div className="flex w-full gap-3 font-semibold pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPrev(selectedCategoryIds, referral_code, isReferralChecked)}
          className="flex-1 px-4 py-2 h-auto border border-[#6B7280] text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#6B7280] cursor-pointer"
        >
          이전
        </Button>
        <Button
          type="submit"
          disabled={!isSubmitEnabled}
          className="flex-2 px-4 py-2 h-auto bg-[#FF5F5F] text-white hover:bg-[#D14848] cursor-pointer"
        >
          회원가입 완료
        </Button>
      </div>
    </form>
  );
}
