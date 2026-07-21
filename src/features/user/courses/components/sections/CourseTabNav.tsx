'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export type CourseTabKey = 'curriculum' | 'instructor' | 'reviews';

interface TabConfig {
  key: CourseTabKey;
  label: string;
}

const ALL_TABS: TabConfig[] = [
  { key: 'curriculum', label: '커리큘럼' },
  { key: 'instructor', label: '강사 정보' },
  { key: 'reviews', label: '수강평' },
];

const SECTION_ID: Record<CourseTabKey, string> = {
  curriculum: 'course-curriculum',
  instructor: 'course-instructor',
  reviews: 'course-reviews',
};

function scrollToSection(key: CourseTabKey) {
  const target = document.getElementById(SECTION_ID[key]);
  if (target) {
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function CourseTabNav() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const initialTab = ALL_TABS.some((tab) => tab.key === requestedTab)
    ? (requestedTab as CourseTabKey)
    : ALL_TABS[0].key;
  const [activeTab, setActiveTab] = useState<CourseTabKey>(initialTab);

  // 다른 페이지에서 ?tab=reviews 같은 쿼리스트링으로 들어온 경우, 탭을 직접 클릭한 것과 동일하게 해당 섹션으로 스크롤 이동
  useEffect(() => {
    if (ALL_TABS.some((tab) => tab.key === requestedTab)) {
      scrollToSection(requestedTab as CourseTabKey);
    }
  }, []);

  // 스크롤 위치에 따라 화면의 섹션을 감지해 활성 탭 갱신
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const matched = ALL_TABS.find((tab) => SECTION_ID[tab.key] === visible.target.id);
          if (matched) setActiveTab(matched.key);
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    ALL_TABS.forEach((tab) => {
      const el = document.getElementById(SECTION_ID[tab.key]);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // 클릭 시 해당 섹션으로 스크롤 이동
  const handleClick = (key: CourseTabKey) => {
    scrollToSection(key);
    setActiveTab(key);
  };

  return (
    <div className="sticky top-4 z-20 flex bg-white rounded-xl shadow-md border-[1.5px] border-[#D1D5DB] overflow-hidden">
      {ALL_TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleClick(tab.key)}
            className={`flex-1 py-4 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 ${
              isActive
                ? 'text-[#FF5E5E] border-[#FF5E5E]'
                : 'text-[#6A7282] border-transparent hover:text-[#1E2125]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export { SECTION_ID };
