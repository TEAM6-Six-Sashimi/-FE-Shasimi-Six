'use client';

import { useState } from 'react';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder: string;
  className?: string;
  initialValue?: string;
}

// 검색창 공용 컴포넌트. 검색 아이콘 클릭 또는 엔터 입력 시에만 검색을 확정한다.
export default function SearchInput({
  onSearch,
  placeholder,
  className = 'w-64',
  initialValue = '',
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSubmit = () => {
    onSearch(inputValue.trim());
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
      />
      <button
        type="button"
        onClick={handleSubmit}
        aria-label="검색"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99A1AF] hover:text-[#1E2125] transition-colors cursor-pointer"
      >
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
            stroke="currentColor"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.4993 17.5003L13.916 13.917"
            stroke="currentColor"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
