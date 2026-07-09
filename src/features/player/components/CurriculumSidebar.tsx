'use client';

import { useRouter } from 'next/navigation';
import { CourseSession } from '@/features/user/courses/types';

interface CurriculumSidebarProps {
  sessions: CourseSession[];
  currentSessionId: number;
  courseId: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CurriculumSidebar({
  sessions,
  currentSessionId,
  courseId,
}: CurriculumSidebarProps) {
  const router = useRouter();

  return (
    <div className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm p-5 flex flex-col lg:min-h-0 lg:overflow-y-auto">
      <h2 className="text-[16px] font-bold text-[#1E2125] mb-4">커리큘럼</h2>
      <div className="flex flex-col gap-2">
        {sessions.map((session, idx) => {
          const isCurrent = session.sessionId === currentSessionId;
          const isPlayable = !!session.videoUrl;
          const href =
            session.lastPositionSeconds && session.lastPositionSeconds > 0
              ? `/player/${session.sessionId}?courseId=${courseId}&t=${session.lastPositionSeconds}`
              : `/player/${session.sessionId}?courseId=${courseId}`;

          return (
            <button
              key={session.sessionId}
              onClick={() => isPlayable && router.replace(href)}
              disabled={!isPlayable}
              className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-colors ${
                isPlayable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              } ${
                isCurrent
                  ? 'border border-[#FF5E5E] bg-[#FFEBEB]'
                  : 'border border-transparent hover:bg-[#F9FAFB]'
              }`}
            >
              <span
                className={`flex-1 wrap-break-word text-[13.5px] font-medium ${
                  isCurrent ? 'text-[#FF5E5E] font-extrabold' : 'text-[#1E2125]'
                }`}
              >
                {idx + 1}. {session.title}
                {session.sessionCompleted && (
                  <span className="text-[11.5px] text-[#9CA3AF] font-normal ml-1">
                    (학습 완료)
                  </span>
                )}
              </span>
              <span
                className={`text-[12.5px] shrink-0 ml-2 ${
                  isCurrent ? 'text-[#FF5E5E] font-bold' : 'text-[#6A7282]'
                }`}
              >
                {formatDuration(session.durationSeconds)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
