import Image from 'next/image';
import { CourseDetailFromAPI, DIFFICULTY_LABEL } from '@/features/user/courses/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
}

// ── 상단: 썸네일 + 가격 ──────────────────────────
interface SidebarThumbnailProps {
  course: CourseDetailFromAPI;
  showPrice?: boolean;
}

export function SidebarThumbnail({ course, showPrice = true }: SidebarThumbnailProps) {
  const thumbnailUrl = getThumbnailUrl(course.thumbnail);

  return (
    <>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden shrink-0 bg-[#D1D5DB]">
        {thumbnailUrl && (
          <Image src={thumbnailUrl} alt={course.title} fill unoptimized className="object-cover" />
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

// ── 하단: 강의 정보 박스 (총 강의수/난이도) ──────
interface SidebarInfoBoxProps {
  course: CourseDetailFromAPI;
}

export default function SidebarInfoBox({ course }: SidebarInfoBoxProps) {
  const lectureCount = course.sessions.length;
  const difficultyLabel = DIFFICULTY_LABEL[course.difficulty] ?? course.difficulty;

  return (
    <div className="flex flex-col gap-2.5 mt-1">
      {[
        { label: '총 강의 수', value: `${lectureCount}강` },
        { label: '난이도', value: difficultyLabel },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between px-2">
          <span className="text-[#6A7282] text-[14px] mb-1">{label}</span>
          <span className="text-[#1E2125] text-[14px] font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}