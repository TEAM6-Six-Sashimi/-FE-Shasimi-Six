'use client';

import { useEffect, useState } from 'react';
import { type Category } from '@/features/categories/types';
import { fetchCategories } from '@/services/categories.service';

interface InterestsProps {
  onPrev: () => void;
  onSubmit: (selectedCategories: string[], referral_code: string) => void;
}

export default function Signup02Interests({ onPrev, onSubmit }: InterestsProps) {
  const [categories, setCategories] = useState<Category[]>([]); // 서버에서 받아올 카테고리 배열
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 사용자가 선택한 카테고리 name 배열
  const [referral_code, setReferralCode] = useState<string>(''); // 추천인 코드 input 값
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const inputCls = 'w-full h-9 px-4 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors';

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('카테고리를 불러오는 중 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(categoryName)
          ? prev.filter((name) => name !== categoryName)
          : [...prev, categoryName],
    );
  };

  const handleFinalSubmit = () => {
    onSubmit(selectedCategories, referral_code);
  };

  return (
    <div>
      <div className="w-full">
        <div className='mb-4'>
          <label className="flex text-[15px] font-medium mb-2">관심 카테고리를 선택해주세요. (선택)</label>
          {isLoading ? (
            <div className="text-sm text-gray-500 animate-pulse">
              카테고리를 불러오는 중입니다...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-sm text-gray-400">등록된 카테고리가 없습니다.</div>
          ) : (
            // 그리드 레이아웃으로 버튼들 배치
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.name)}
                    className={`py-2.5 px-4 rounded-full text-[15px] font-semibold border-[1.5px] transition-all duration-100 ${
                      isSelected
                        ? 'bg-[#F9FBE7] text-[#827717] border-none' // 활성화 상태
                        : 'bg-white text-[#6A7282] border-[#D1D5DB] hover:bg-gray-50' // 비활성화 상태
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className='mb-4'>
          <label className='flex text-[15px] font-medium mb-2'>추천인 코드가 있으신가요? (선택)</label>
          <div className='flex gap-1.5'>
            <input
              type="text"
              value={referral_code}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="추천인 코드를 입력해주세요"
              className={inputCls}
            />
            <button
              type="button"
              className='px-4 py-2 text-[12px] rounded-lg font-medium whitespace-nowrap min-w-23.75 bg-[#FF5F5F] text-white hover:bg-[#D14848] cursor-pointer'>추천인 확인</button>
          </div>
        </div>

        <div className='flex w-full gap-1.5'>
          <button
            onClick={onPrev}
            className="px-4 py-2 bg-white rounded-lg  border border-[#6B7280] text-[#6B7280] hover:bg-[#F9FAFB]"
          >
            이전
          </button>
          <button
            onClick={handleFinalSubmit}
            className="px-4 py-2 bg-[#FF5F5F] rounded-lg text-white hover:bg-[#D14848]"
          >
            회원가입 완료
          </button>
        </div>
      </div>
    </div>
  );
}
