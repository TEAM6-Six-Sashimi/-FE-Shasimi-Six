'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ---- 사이드바 메뉴 데이터------------------------------------------
const BASE_MENUS = [
  { label: '개인정보 조회', href: '/mypage', icon: 'mypage' },
  { label: '강사 지원 내역', href: '/mypage/instructor-application-list', icon: 'instructor-application' },
  { label: '크레딧 충전 내역', href: '/mypage/credit-charge', icon: 'credit' },
  { label: '결제 내역', href: '/mypage/payments', icon: 'payments' },
] as const;

// ---- 메인 컴포넌트 ------------------------------------------------
const STUDENT_MENU = { label: '나의 이력서', href: '/mypage/resume', icon: 'resume' };
const INSTRUCTOR_MENU = { label: '강사 프로필', href: '/mypage/instructor-profile', icon: 'resume' };
const INSTRUCTOR_SETTLEMENT_MENU = { label: '정산 내역', href: '/mypage/settlements', icon: 'settlements' };

interface UserSidebarProps {
  role?: string;
}

export default function UserSidebar({ role }: UserSidebarProps) {
  const pathname = usePathname();
  const isInstructor = role === 'INSTRUCTOR';

  const menus = [
    BASE_MENUS[0],
    isInstructor ? INSTRUCTOR_MENU : STUDENT_MENU,
    ...BASE_MENUS.slice(1),
    ...(isInstructor ? [INSTRUCTOR_SETTLEMENT_MENU] : []),
  ];

  return (
    <aside className="w-48 shrink-0 bg-[#1E2125] p-2">
      <div className="px-4 py-3 mb-1">
        <span className="text-[#CFEE5D] text-[17px] font-bold">마이페이지</span>
      </div>

      <nav className="flex flex-col gap-2">
        {menus.map(({ label, href, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                text-[13.5px] font-medium
                transition-colors duration-150
                ${isActive ? 'bg-[#CFEE5D] text-[#1E2125] font-semibold' : 'text-[#F9FAFB] hover:bg-white/5'}
              `}
            >
              <span className="relative flex items-center shrink-0 w-5 h-5">
                <Image
                  src={`/sidebar/${icon}-Icon-white.svg`}
                  alt=""
                  width={20}
                  height={20}
                  className={`transition-opacity duration-150 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                />
                <Image
                  src={`/sidebar/${icon}-Icon.svg`}
                  alt=""
                  width={20}
                  height={20}
                  className={`absolute transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}