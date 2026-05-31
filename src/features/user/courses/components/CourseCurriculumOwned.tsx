'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CourseSession } from '../types';

interface CourseCurriculumOwnedProps {
  sessions: CourseSession[];
  lastSessionId: number;
}

const PREVIEW_COUNT = 5;

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}분 ${s > 0 ? `${s}초` : ''}`.trim();
  return `${s}초`;
}

export default function CourseCurriculumOwned({ sessions, lastSessionId }: CourseCurriculumOwnedProps) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
  const visible = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[#1E2125] text-[17px] font-bold">커리큘럼</h2>

      <div className="flex flex-col gap-3">
        {visible.map((session) => {
          const isLast = session.sessionId === lastSessionId;
          return (
            <div
              key={session.sessionId}
              className={`flex flex-col gap-3 rounded-lg px-4 py-3 border-2 ${
                isLast ? 'border-[#FF5E5E] bg-[#FFF5F5]' : 'border-[#E5E7EB]'
              }`}
            >
              {/* 회차 헤더 */}
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] text-[#1E2125]">
                  {session.sessionOrder}.  {session.title}
                  {isLast && (
                    <span className="ml-2 text-[11px] text-[#FF5E5E] font-semibold">
                      마지막 수강
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] text-[#6A7282]">{formatSeconds(session.durationSeconds)}</span>
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
            </div>
          );
        })}
      </div>

      {sorted.length > PREVIEW_COUNT && (
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