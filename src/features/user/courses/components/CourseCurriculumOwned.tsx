'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CurriculumItem {
  id: number;
  title: string;
  duration: string;
  isPreview: boolean;
  progress?: number;
}

interface CourseCurriculumOwnedProps {
  curriculum: CurriculumItem[];
}

const PREVIEW_COUNT = 5;

export default function CourseCurriculumOwned({ curriculum }: CourseCurriculumOwnedProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleLectures = expanded ? curriculum : curriculum.slice(0, PREVIEW_COUNT);
  const hasMore = curriculum.length > PREVIEW_COUNT;

  const progressColor = (progress: number) => {
    if (progress >= 30) return 'bg-[#CFEE5D]';
    return 'bg-[#E5E7EB]';
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[#1E2125] text-[17px] font-bold">커리큘럼</h2>

      <div className="flex flex-col gap-3">
        {visibleLectures.map((lecture, idx) => {
          const progress = lecture.progress ?? 0;
          return (
            <div
              key={lecture.id}
              className="flex flex-col gap-3 border-2 border-[#E5E7EB] rounded-lg px-4 py-3"
            >
              {/* 회차 헤더 */}
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] text-[#1E2125]">
                  {idx + 1}.  {lecture.title}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] text-[#6A7282]">{lecture.duration}</span>
                  <Button
                    size="sm"
                    className="h-7 px-3 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12px] font-semibold cursor-pointer"
                    onClick={() => {
                      // TODO: 강의 재생 페이지 연결
                    }}
                  >
                    재생
                  </Button>
                </div>
              </div>
              {/* 진행률 바 */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${progressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[11.5px] text-[#6A7282] w-8 text-right">
                  {progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[13px] text-[#6A7282] hover:text-[#1E2125] cursor-pointer text-center"
        >
          {expanded ? '∧ 접기' : '∨ 더보기'}
        </button>
      )}
    </div>
  );
}