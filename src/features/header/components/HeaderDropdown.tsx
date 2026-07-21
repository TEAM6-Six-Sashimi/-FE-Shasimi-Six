'use client';

import { UserMe } from '@/features/auth/types';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { logoutAction } from '@/features/auth/actions';

interface HeaderDropdownProps {
  user: UserMe;
}

export default function HeaderDropdown({ user }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropMenu = {
    STUDENT: [{ label: '마이페이지', href: '/mypage' }],
    INSTRUCTOR: [
      { label: '마이페이지', href: '/mypage' },
      { label: '강사 프로필', href: '/mypage/instructor-profile' },
    ],
    ADMIN: [{ label: '마이페이지', href: '/mypage' }],
    GUEST: [],
  };

  const currentMenu = dropMenu[user.role] || [];

  // (강사)
  const displayName = user.role === 'INSTRUCTOR' ? `${user.name} (강사)` : user.name;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={`flex items-center gap-1 cursor-pointer h-8 px-2 rounded-md transition-colors duration-200
                    ${isOpen ? 'bg-[#E5E7EB]' : 'hover:bg-[#E5E7EB]'}
            `}
      >
        <Image src="/sidebar/mypage-Icon.svg" width={17} height={17} alt="프로필 이미지" />
        <span className="text-[15px] font-medium h-8 flex items-center justify-center whitespace-nowrap px-1">
          {displayName}
        </span>
        <Image
          src="/header/open.svg"
          width={15}
          height={15}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          alt="드롭다운 열림/닫힘"
        />
      </div>

      {/* 드롭박스 */}
      {isOpen && (
        <div className="absolute right-0 top-full w-37 bg-white border border-[#D1D5DB] rounded-md py-1 z-100 animate-fadeIn">
          {currentMenu.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block px-4 py-2 text-[15px] text-[#1E2125] hover:bg-[#E5E7EB]"
            >
              {item.label}
            </Link>
          ))}
          <hr className="border-[#D1D5DB]" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full text-left block px-4 py-2 text-[#D14848] hover:bg-[#E5E7EB] cursor-pointer"
            >
              로그아웃
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
