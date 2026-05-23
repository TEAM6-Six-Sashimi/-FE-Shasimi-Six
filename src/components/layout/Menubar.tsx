'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/constants/categories';

// ---- Chevron (열림/닫힘 회전 애니메이션)----------------------
const ChevronIcon = ({ open }: { open: boolean }) => (
  <Image
    src="/menubar/open-Icon.svg"
    alt=""
    width={13}
    height={13}
    className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
  />
);

// ---- 네비게이션 링크 정의--------------------------------------
const NAV_LINKS = [
  {
    id: 'ai',
    label: 'AI 추천',
    icon: '/menubar/recommendation-Icon.svg',
    iconWhite: '/menubar/recommendation-Icon-white.svg',
    href: '/recommendations',
  },
  {
    id: 'roadmap',
    label: '로드맵',
    icon: '/menubar/roadmap-Icon.svg',
    iconWhite: '/menubar/roadmap-Icon-white.svg',
    href: '/roadmap',
  },
  {
    id: 'mycourse',
    label: '내 강의',
    icon: '/menubar/mycourses-Icon.svg',
    iconWhite: '/menubar/mycourses-Icon-white.svg',
    href: '/mycourses-student',
  },
  {
    id: 'instructor',
    label: '강사지원',
    icon: '/menubar/instructor-Icon.svg',
    iconWhite: '/menubar/instructor-Icon-white.svg',
    href: '/instructor/application',
  },
] as const;

// ---- 메인 컴포넌트 --------------------------------------------
export default function Menubar() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  return (
    <nav
      ref={wrapperRef}
      className="relative z-50 bg-[#1E2125] border-b border-white/10 font-sans"
      onMouseLeave={() => setOpen(false)}
    >
      {/* 메뉴바 내부 */}
      <div className="flex items-center h-12 px-5">
        {/* 카테고리 토글 버튼 */}
        <button
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup="true"
          className={`
            flex items-center gap-2 h-full pr-4 mr-2
            border-r border-white/10
            text-[13px] font-semibold tracking-tight whitespace-nowrap
            bg-transparent cursor-pointer transition-colors duration-150
            ${open ? 'text-[#CFEE5D]' : 'text-[#E5E7EB] hover:text-[#CFEE5D]'}
          `}
        >
          <span className="flex items-center shrink-0">
            <Image src="/menubar/menu-Icon.svg" alt="메뉴" width={16} height={16} />
          </span>
          자격증 카테고리(전체 자격증)
          <ChevronIcon open={open} />
        </button>

        {/* 우측 링크 그룹 */}
        <div className="flex items-center gap-0.5 ml-auto">
          {NAV_LINKS.map(({ id, label, icon, iconWhite, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={id}
                href={href}
                className={`group flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] font-medium tracking-tight whitespace-nowrap transition-colors duration-150 hover:text-[#CFEE5D] hover:bg-white/5 ${isActive ? 'text-[#CFEE5D]' : 'text-[#F9FAFB]'}`}
              >
                <span className="relative flex items-center shrink-0 w-4 h-4">
                  {/* 기본: 흰색 아이콘 */}
                  <Image
                    src={iconWhite}
                    alt=""
                    width={16}
                    height={16}
                    className={`transition-opacity duration-150 ${isActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
                  />
                  {/* 호버/활성: 라임색 아이콘 */}
                  <Image
                    src={icon}
                    alt=""
                    width={16}
                    height={16}
                    className={`absolute transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  />
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 드롭다운 */}
      <div
        className={`
          absolute top-full left-0 w-full
          bg-[#1E2125] border-t-2 border-[#CFEE5D] border-b border-b-white/10
          shadow-[0_16px_48px_rgba(0,0,0,0.55)]
          overflow-hidden transition-all duration-280 ease-in-out
          ${open ? 'max-h-140 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
      >
        <div className="grid grid-cols-7 px-5 py-6">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.label}
              className={`px-3.5 ${i === 0 ? 'pl-1' : ''} ${i === CATEGORIES.length - 1 ? 'border-r-0 pr-1' : 'border-r border-white/10'}`}
            >
              {/* 카테고리 타이틀 */}
              <div className="text-[#CFEE5D] text-[13.5px] font-extrabold tracking-tight leading-snug mb-3 pb-2.5 border-b border-white/10">
                {cat.label}
              </div>

              {/* 서브 항목 */}
              {cat.sub.map((item) => (
                <button
                  key={item}
                  onClick={() => setOpen(false)}
                  className={`
                    block w-full text-left bg-transparent border-none cursor-pointer
                    text-[12.5px] tracking-tight py-1.5 transition-colors duration-150
                    text-[#F9FAFB] hover:text-[#CFEE5D]
                    ${item === '전체' ? 'font-semibold mb-0.5' : 'font-normal'}
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
