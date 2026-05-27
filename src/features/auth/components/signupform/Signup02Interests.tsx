'use client';

import { useEffect, useState } from 'react';
import { fetchCategories, type Category } from '@/features/categories/types';

interface InterestsProps {
  onPrev: () => void;
  onSubmit: (selectedCategories: string[], referral_code: string) => void;
}

export default function Signup02Interests({ onPrev, onSubmit }: InterestsProps) {
  const [categories, setCategories] = useState<Category[]>([]); // 서버에서 받아올 카테고리 배열
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 사용자가 선택한 카테고리 name 배열
  const [referral_code, setReferralCode] = useState<string>(''); // 추천인 코드 input 값
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          ? prev.filter((name) => name !== categoryName) // 이미 선택되어 있으면 배열에서 제거
          : [...prev, categoryName], // 선택 안 되어 있으면 배열에 추가
    );
  };

  const handleFinalSubmit = () => {
    onSubmit(selectedCategories, referral_code);
  };

  return (
    <div>
      <div className="w-full">
        <div>
          <label>관심 카테고리를 선택해주세요. (선택)</label>
          {isLoading ? (
            <div className="text-sm text-gray-500 animate-pulse">
              카테고리를 불러오는 중입니다...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-sm text-gray-400">등록된 카테고리가 없습니다.</div>
          ) : (
            // 그리드 레이아웃으로 버튼들 배치
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.name)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#FF5F5F] text-white border-[#FF5F5F] shadow-sm' // 활성화 상태
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' // 비활성화 상태
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label>추천인 코드가 있으신가요? (선택)</label>
          <input
            type="text"
            value={referral_code}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="추천인 코드를 입력해주세요"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#FF5F5F]"
          />
          <button type="button">추천인 확인</button>
        </div>

        <div>
          <button
            onClick={onPrev}
            className="bg-white rounded-lg border-[#6A7282] text-[#6A7282] hover:bg-[#F9FAFB]"
          >
            이전
          </button>
          <button
            onClick={handleFinalSubmit}
            className="bg-[#FF5F5F] rounded-lg text-white hover:bg-[#D14848]"
          >
            회원가입 완료
          </button>
        </div>
      </div>
    </div>
  );
}
