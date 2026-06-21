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

  const inputCls =
    'w-full h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('카테고리 목록을 로드하지 못했습니다.', error);
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
      alert('추천인 코드 확인을 완료해 주세요.');
      return;
    }

    onSubmit(selectedCategoryIds, referral_code);
  };

  if (isLoading)
    return <div className="text-center py-10 text-sm text-gray-500">카테고리를 불러오는 중...</div>;

  return (
    <form onSubmit={handleFinalSubmit} className="w-full max-w-md mx-auto space-y-8 py-6">
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
                className={`py-2.5 px-4 h-auto rounded-full text-[15px] font-semibold border-[1.5px] transition-all duration-100 ${
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

      <div className="border-t border-gray-100 pt-6">
        <label className="block text-[13px] font-semibold text-[#1E2125] mb-1.5">
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
            className={`px-4 h-9 text-[12px] font-medium whitespace-nowrap min-w-23.75 ${
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

      <div className="flex w-full gap-3 font-semibold">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPrev(selectedCategoryIds, referral_code, isReferralChecked)}
          className="flex-1 px-4 py-2 h-auto border border-[#6B7280] text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#6B7280]"
        >
          이전
        </Button>
        <Button
          type="submit"
          className="flex-2 px-4 py-2 h-auto bg-[#FF5F5F] text-white hover:bg-[#D14848]"
        >
          회원가입 완료
        </Button>
      </div>
    </form>
  );
}
