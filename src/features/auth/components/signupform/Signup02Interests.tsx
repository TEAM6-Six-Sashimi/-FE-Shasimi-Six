'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/services/categories.service';
import { Category } from '@/features/categories/types';
import { Button } from '@/components/ui/button';
import CategorySelector from './fields/CategorySelectorfield';
import ReferralCodeField from './fields/Referralcodefield';
import AgreementSection, { AgreementState } from './fields/Agreementsfield';

interface InterestsProps {
  initialCategories: number[];
  initialReferralCode: string;
  initialReferralChecked: boolean;
  onPrev: (selectedCategories: number[], referral_code: string, isReferralChecked: boolean) => void;
  onSubmit: (selectedCategories: number[], referral_code: string) => void;
}

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // 약관 동의 상태
  const [agreements, setAgreements] = useState<AgreementState>({
    privacy: false,
    marketing: false,
    emailNotice: false,
    aiUsage: false,
  });

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

  const handleAgreementToggle = (key: keyof AgreementState) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (referral_code && !isReferralChecked) {
      setSubmitMessage('추천인 코드 확인을 완료해 주세요.');
      return;
    }

    onSubmit(selectedCategoryIds, referral_code);
  };

  const isSubmitEnabled = agreements.privacy;

  if (isLoading)
    return <div className="text-center py-10 text-sm text-gray-500">카테고리를 불러오는 중...</div>;

  return (
    <form onSubmit={handleFinalSubmit}>
      <CategorySelector
        categories={categories}
        selectedIds={selectedCategoryIds}
        onToggle={handleCategoryToggle}
      />

      <ReferralCodeField
        value={referral_code}
        onChange={setReferralCode}
        isChecked={isReferralChecked}
        onCheckedChange={setIsReferralChecked}
      />

      <div className="pt-6">
        <AgreementSection agreements={agreements} onToggle={handleAgreementToggle} />
      </div>

      {submitMessage && <p className="text-xs mt-2 font-medium text-red-500">{submitMessage}</p>}

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
