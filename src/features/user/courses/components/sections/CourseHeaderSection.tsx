import Image from 'next/image';
import { CourseDetailFromAPI } from '../../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CourseHeaderSectionProps {
  course: CourseDetailFromAPI;
  /** 강사/관리자 검수 화면에서 카테고리 뱃지를 2개(예: 메인+서브) 보여줘야 하는 경우 */
  extraBadge?: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-[16px] ${star <= Math.round(rating) ? 'text-[#FFD700]' : 'text-[#D1D5DB]'}`}
      >
        ★
      </span>
    ))}
  </div>
);

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}
 
function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
}

export default function CourseHeaderSection({ course, extraBadge }: CourseHeaderSectionProps) {
  const thumbnailUrl = getThumbnailUrl(course.thumbnail);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden flex flex-col gap-4">
      {/* 썸네일 */}
      <div
        className="relative rounded-t-xl -mx-6 -mt-6 bg-[#E5E7EB]"
        style={{ width: 'calc(100% + 3rem)', height: '240px' }}
      >
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={course.title}
            fill
            unoptimized
            className="object-cover rounded-t-xl"
          />
        )}
      </div>
 
      {/* 카테고리 뱃지 */}
      <div className="flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-full bg-[#FFEBEB] text-[#FF5E5E] text-[12px] font-medium">
          {course.categoryName}
        </div>
        {extraBadge && (
          <div className="px-2.5 py-1 rounded-full bg-[#F9FBE7] text-[#827717] text-[12px] font-medium">
            {extraBadge}
          </div>
        )}
      </div>
 
      {/* 제목 + 설명 */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[#1E2125] text-[22px] font-bold leading-snug">{course.title}</h1>
        <p className="text-[#6A7282] text-[13.5px]">{course.description}</p>
      </div>
 
      {/* 평점 */}
      <div className="flex items-center gap-1.5">
        <StarRating rating={course.ratingAvg} />
        <span className="text-[#1E2125] text-[13.5px] font-semibold">
          {course.ratingAvg.toFixed(1)}
        </span>
        <span className="text-[#6A7282] text-[13px]">
          ({course.reviewCount.toLocaleString()}개의 리뷰)
        </span>
      </div>
 
      {/* 수강생 + 시간 */}
      <div className="flex items-center gap-4 text-[13px] text-[#6A7282]">
        <span className="flex items-center gap-1.5">
          <Image src="/coursedetail/people.svg" width={17} height={17} alt="" />
          {course.studentCount.toLocaleString()}명 수강
        </span>
        <span className="flex items-center gap-1.5">
          <Image src="/coursedetail/clock.svg" width={17} height={17} alt="" />
          {formatDuration(course.totalDuration)}
        </span>
      </div>
    </div>
  )
}