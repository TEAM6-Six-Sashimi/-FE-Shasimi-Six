import Image from 'next/image';
import { CourseDetailFromAPI, DIFFICULTY_LABEL } from '@/features/user/courses/types';
import { getThumbnailUrl } from '@/lib/thumbnail';

// ── 상단: 썸네일 + 가격 ──────────────────────────
interface SidebarThumbnailProps {
  course: CourseDetailFromAPI;
  showPrice?: boolean;
}

export function SidebarThumbnail({ course, showPrice = true }: SidebarThumbnailProps) {
  const thumbnailUrl = getThumbnailUrl(course.thumbnail);

  return (
    <>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden shrink-0 bg-[#E5E7EB]">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt={course.title} fill unoptimized className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#9CA3AF] text-[13px]">
            썸네일을 불러올 수 없습니다.
          </div>
        )}
      </div>

      {showPrice && (
        <p className="text-[#1E2125] text-[22px] font-bold">
          {course.price.toLocaleString()} 크레딧
        </p>
      )}
    </>
  );
}

// ── 하단: 강의 정보 박스 (총 강의수/난이도/진도율) ──────
interface SidebarInfoBoxProps {
  course: CourseDetailFromAPI;
}

export default function SidebarInfoBox({ course }: SidebarInfoBoxProps) {
  const lectureCount = course.sessions.length;
  const difficultyLabel = DIFFICULTY_LABEL[course.difficulty] ?? course.difficulty;

  // ENROLLED일 때만 progressRate/completed 값이 채워져 있음
  const hasProgress = course.viewerType === 'ENROLLED' && course.progressRate !== null;

  const infoRows = [
    { label: '총 강의 수', value: `${lectureCount}강` },
    { label: '난이도', value: difficultyLabel },
  ];

  return (
    <div className="flex flex-col gap-2.5 mt-1">
      {infoRows.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between px-2">
          <span className="text-[#6A7282] text-[14px] mb-1">{label}</span>
          <span className="text-[#1E2125] text-[14px] font-semibold">{value}</span>
        </div>
      ))}

      {hasProgress && (
        <div className="px-2 pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[#6A7282] text-[14px]">학습 진도율</span>
            <span className="text-[#1E2125] text-[14px] font-semibold">
              {course.progressRate}%{course.completed ? ' (완강)' : ''}
            </span>
          </div>
          <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#CFEE5D] rounded-full"
              style={{ width: `${course.progressRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
