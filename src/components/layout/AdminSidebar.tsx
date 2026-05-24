'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ---- 사이드바 메뉴 데이터------------------------------------------
const SIDEBAR_MENUS = [
  { label: '대시보드', href: '/admin', icon: 'dashboard' },
  { label: '회원 관리', href: '/admin/usermanage', icon: 'user' },
  { label: '강의 관리', href: '/admin/coursemanage', icon: 'course' },
  { label: '신고 관리', href: '/admin/reportmanage', icon: 'report' },
  { label: '결제 관리', href: '/admin/paymentmanage', icon: 'payments' },
  { label: '정산 관리', href: '/admin/settlementmanage', icon: 'settlement' },
  { label: '프롬프트 관리', href: '/admin/promptmanage', icon: 'prompt' },
] as const;

// ---- 메인 컴포넌트 ------------------------------------------------
export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0 bg-[#1E2125] p-2">
      {/* 타이틀 */}
      <div className="px-4 py-3 mb-1">
        <span className="text-[#CFEE5D] text-[17px] font-bold">관리자 페이지</span>
      </div>

      {/* 메뉴 목록 */}
      <nav className="flex flex-col gap-2">
        {SIDEBAR_MENUS.map(({ label, href, icon }) => {
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
              {/* 아이콘 */}
              <span className="relative flex items-center shrink-0 w-5 h-5">
                {/* 기본: 흰색 아이콘 */}
                <Image
                  src={`/sidebar/${icon}-Icon-white.svg`}
                  alt=""
                  width={20}
                  height={20}
                  className={`transition-opacity duration-150 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                />
                {/* 활성: 검정 아이콘 */}
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
