'use client';

import Link from 'next/link';
import { CourseSession } from '@/features/user/courses/types';

interface CourseCurriculumSectionProps {
  courseId: number;
  sessions: CourseSession[];
  /** 진행률바 표시 여부 - 구매한 학생(ENROLLED)만 true */
  showProgress: boolean;
  /** 모든 세션 재생 가능 여부 - 강사/관리자/구매자는 true, 미구매자는 preview만 가능 */
  allSessionsPlayable: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function CourseCurriculumSection({
  courseId,
  sessions,
  showProgress,
  allSessionsPlayable,
}: CourseCurriculumSectionProps) {
  const sorted = [...sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);

  return (
    <div>
      <h2 className="text-[#1E2125] text-[17px] font-bold mb-4">커리큘럼</h2>
      <ul className="flex flex-col gap-3">
        {sorted.map((session, idx) => {
          // videoUrl이 null이면 백엔드가 재생 권한 자체를 안 준 것이므로(PUBLIC + non-preview 등) 우선 체크
          const canPlay = (allSessionsPlayable || session.preview) && !!session.videoUrl;
          const progress = session.sessionProgressRate ?? 0;

          // 완료된 세션은 처음부터 다시보기, 미완료 세션은 마지막 시청 지점부터 이어보기
          const hasResumePoint =
            !session.sessionCompleted &&
            session.lastPositionSeconds !== null &&
            session.lastPositionSeconds > 0;

          const playerHref = hasResumePoint
            ? `/player/${session.sessionId}?courseId=${courseId}&t=${session.lastPositionSeconds}`
            : `/player/${session.sessionId}?courseId=${courseId}`;

          const buttonLabel = session.sessionCompleted
            ? '다시보기'
            : showProgress && hasResumePoint
              ? '이어보기'
              : '재생';

          return (
            <li key={session.sessionId} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[#6A7282] text-[13px] w-5 text-center">{idx + 1}</span>
                  <div className="flex flex-col">
                    <span className="text-[#1E2125] text-[13.5px] font-medium">
                      {session.title}
                      {session.sessionCompleted && (
                        <span className="text-[11.5px] text-[#9CA3AF] font-normal ml-1">
                          (학습 완료)
                        </span>
                      )}
                    </span>
                    {/* 미구매자에게 일부 세션만 미리보기 가능함을 안내 */}
                    {!allSessionsPlayable && session.preview && (
                      <span className="text-[#FF5E5E] text-[11.5px] font-medium">
                        미리보기 가능
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[#6A7282] text-[12.5px]">
                    {formatTime(session.durationSeconds)}
                  </span>
                  {canPlay ? (
                    <Link
                      href={playerHref}
                      className="px-3 py-1 rounded-md bg-[#FF5E5E] text-white text-[12px] font-semibold hover:bg-[#D14848] transition-colors"
                    >
                      {buttonLabel}
                    </Link>
                  ) : (
                    <span className="px-3 py-1 rounded-md bg-[#E5E7EB] text-[#9CA3AF] text-[12px] font-semibold">
                      재생
                    </span>
                  )}
                </div>
              </div>

              {/* 진행률바 - 구매한 학생(ENROLLED)만 표시, 세션별 실제 진행률 사용 */}
              {showProgress && (
                <div className="flex items-center gap-2 pl-8">
                  <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#CFEE5D] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[#6A7282] text-[11.5px] w-9 text-right">{progress}%</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
