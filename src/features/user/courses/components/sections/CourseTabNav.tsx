'use client';

import { useEffect, useState } from 'react';

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

export default function CourseTabNav() {
  const [activeTab, setActiveTab] = useState<CourseTabKey>(ALL_TABS[0].key);

  // 스크롤 위치에 따라 화면에 보이는 섹션을 감지해서 활성 탭 갱신
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
    const target = document.getElementById(SECTION_ID[key]);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setActiveTab(key);
  };

  return (
    <div className="sticky top-4 z-0 flex bg-white rounded-xl shadow-md border-[1.5px] border-[#D1D5DB] overflow-hidden">
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
