'use client';

import { useState } from 'react';
import type { CurriculumItem } from '@/constants/mockCourseDetail';

interface CourseCurriculumProps {
  curriculum: CurriculumItem[];
}

const PREVIEW_COUNT = 5;

export default function CourseCurriculum({ curriculum }: CourseCurriculumProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? curriculum : curriculum.slice(0, PREVIEW_COUNT);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[#1E2125] text-[17px] font-bold">커리큘럼</h2>

      <div className="flex flex-col gap-1.5">
        {visible.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]"
          >
            {/* 번호 + 제목 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-[#6A7282] text-[13px] shrink-0">{item.id}</span>
              <span className="text-[#1E2125] text-[13px] truncate">{item.title}</span>
            </div>

            {/* 시간 + 버튼 */}
            <div className="flex items-center gap-2.5 shrink-0 ml-3">
              <span className="text-[#6A7282] text-[12.5px]">{item.duration}</span>
              {item.isPreview ? (
                <button className="px-2.5 py-1 rounded-md bg-[#FF5E5E] text-white text-[11.5px] font-semibold cursor-pointer hover:bg-[#D14848] transition-colors">
                  재생
                </button>
              ) : (
                <button
                  disabled
                  className="px-2.5 py-1 rounded-md bg-[#E5E7EB] text-[#6A7282] text-[11.5px] font-semibold cursor-not-allowed"
                >
                  재생
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 / 접기 */}
      {curriculum.length > PREVIEW_COUNT && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[#6A7282] text-[13px] hover:text-[#1E2125] transition-colors cursor-pointer text-center py-1"
        >
          {expanded ? '▲ 접기' : `∨ 더보기 (${curriculum.length - PREVIEW_COUNT}개)`}
        </button>
      )}
    </section>
  );
}
