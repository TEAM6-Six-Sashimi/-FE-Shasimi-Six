'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Category } from '@/features/categories/types';

// ---- Chevron ---------------------------------------------------
const ChevronIcon = ({ open }: { open: boolean }) => (
  <Image
    src="/menubar/open-Icon.svg"
    alt=""
    width={13}
    height={13}
    className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
  />
);

interface MenubarProps {
  categories: Category[];
  role?: 'STUDENT' | 'INSTRUCTOR' | 'GUEST';
}

// ---- 메인 컴포넌트 ---------------------------------------------
export default function Menubar({ categories, role }: MenubarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const myCoursesHref = role === 'INSTRUCTOR' ? '/mycourses-instructor' : '/mycourses-student';

  const NAV_LINKS = [
    { id: 'ai-subscribe', label: 'AI 구독권', icon: 'subscribe', href: '/ai-subscribe' },
    { id: 'ai-recommendation', label: 'AI 강의 추천', icon: 'recommendations', href: '/recommendations' },
    { id: 'ai-resume', label: 'AI 이력서 평가', icon: 'resume', href: '/resume' },
    { id: 'community', label: '커뮤니티', icon: 'community', href: '/community' },
    { id: 'mycourse', label: '내 강의', icon: 'mycourses', href: myCoursesHref },
    { id: 'instructor', label: '강사지원', icon: 'instructor', href: '/instructor-application' },
  ];

  return (
    <nav
      className="relative z-50 bg-[#1E2125] border-b border-white/10 font-sans"
      onMouseLeave={() => setOpen(false)}
    >
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
            text-[13px] font-semibold whitespace-nowrap
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
          {NAV_LINKS.map(({ id, label, icon, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={id}
                href={href}
                className={`group flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] font-medium tracking-tight whitespace-nowrap transition-colors duration-150 hover:text-[#CFEE5D] hover:bg-white/5 ${isActive ? 'text-[#CFEE5D]' : 'text-[#F9FAFB]'}`}
              >
                <span className="relative flex items-center shrink-0 w-4 h-4">
                  <Image
                    src={`/menubar/${icon}-Icon-white.svg`}
                    alt=""
                    width={16}
                    height={16}
                    className={`transition-opacity duration-150 ${isActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
                  />
                  <Image
                    src={`/menubar/${icon}-Icon.svg`}
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
        <div
          className={`grid px-5 py-6`}
          style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`px-3.5 ${i === 0 ? 'pl-1' : ''} ${i === categories.length - 1 ? 'border-r-0 pr-1' : 'border-r border-white/10'}`}
            >
              {/* 카테고리 타이틀 */}
              <div className="text-[#CFEE5D] text-[13.5px] font-extrabold tracking-tight leading-snug mb-3 pb-2.5 border-b border-white/10 cursor-default">
                {cat.name}
              </div>

              {/* 서브 항목 */}
              {[{ id: 0, name: '전체' }, ...cat.options].map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.name === '전체'
                      ? `/courses/${encodeURIComponent(cat.name)}`
                      : `/courses/${encodeURIComponent(cat.name)}?sub=${item.id}`
                  }
                  onClick={() => setOpen(false)}
                  className={`
      block text-[12.5px] tracking-tight py-1.5 transition-colors duration-150
      text-[#F9FAFB] hover:text-[#CFEE5D]
      ${item.name === '전체' ? 'font-semibold mb-0.5' : 'font-normal'}
    `}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
