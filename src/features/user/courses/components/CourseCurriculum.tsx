'use client';

import { useState } from 'react';
import { CourseSession } from '@/features/user/courses/types';

interface CourseCurriculumProps {
  sessions: CourseSession[];
}

const PREVIEW_COUNT = 5;

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}분 ${s > 0 ? `${s}초` : ''}`.trim();
  return `${s}초`;
}

export default function CourseCurriculum({ sessions }: CourseCurriculumProps) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
  const visible = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[#1E2125] text-[17px] font-bold">커리큘럼</h2>

      <div className="flex flex-col gap-1.5">
        {visible.map((session) => (
          <div
            key={session.sessionId}
            className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]"
          >
            {/* 번호 + 제목 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-[#6A7282] text-[13px] shrink-0">{session.sessionOrder}</span>
              <span className="text-[#1E2125] text-[13px] truncate">{session.title}</span>
            </div>

            {/* 시간 + 버튼 */}
            <div className="flex items-center gap-2.5 shrink-0 ml-3">
              <span className="text-[#6A7282] text-[12.5px]">{formatSeconds(session.durationSeconds)}</span>
              {session.preview ? (
                <button className="px-2.5 py-1 rounded-md bg-[#FF5E5E] text-white text-[11.5px] font-semibold cursor-pointer hover:bg-[#D14848] transition-colors">
                  미리보기
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
      {sorted.length > PREVIEW_COUNT && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[#6A7282] text-[13px] hover:text-[#1E2125] transition-colors cursor-pointer text-center py-1"
        >
          {expanded ? '▲ 접기' : `∨ 더보기 (${sorted.length - PREVIEW_COUNT}개)`}
        </button>
      )}
    </section>
  );
}
