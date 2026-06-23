import Image from 'next/image';
import { CourseDetailFromAPI } from '../../types';
import { Category } from '@/features/categories/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CourseHeaderSectionProps {
  course: CourseDetailFromAPI;
  /** 강사/관리자 검수 화면에서 카테고리 뱃지를 2개(예: 메인+서브) 보여줘야 하는 경우 */
  categories: Category[];
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
 
function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
}

// 대카테고리 > 소카테고리 (대카테고리 역추적)
function getMainCategoryName(categories: Category[], subCategoryName: string): string | null {
  for (const cat of categories) {
    const found = cat.options.some((opt) => opt.name === subCategoryName);
    if (found) return cat.name;
  }
  return null;
}

export default function CourseHeaderSection({ course, categories }: CourseHeaderSectionProps) {
  const thumbnailUrl = getThumbnailUrl(course.thumbnail);
  const mainCategoryName = getMainCategoryName(categories, course.categoryName);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden flex flex-col">
      {/* 썸네일 */}
      <div
        className="relative rounded-t-xl -mx-6 -mt-6 mb-5 bg-[#E5E7EB]"
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
 
      {/* 대카테고리 > 소카테고리 */}
      <p className="text-[#FF5E5E] text-[13px] font-medium mb-1">
        {mainCategoryName ? `${mainCategoryName} > ${course.categoryName}` : course.categoryName}
      </p>
 
      {/* 제목 + 설명 */}
      <div className="flex flex-col gap-1.5 mb-3">
        <h1 className="text-[#1E2125] text-[22px] font-bold leading-snug">{course.title}</h1>
        <p className="text-[#6A7282] text-[13.5px]">{course.description}</p>
      </div>
 
      {/* 평점 + 수강생 수 + 등록일 (한 줄) */}
      <div className="flex items-center gap-4 text-[13.5px]">
        <div className="flex items-center gap-1.5">
          <StarRating rating={course.ratingAvg} />
          <span className="text-[#1E2125] font-semibold">{course.ratingAvg.toFixed(1)}</span>
        </div>
        <span className="flex items-center gap-1.5 text-[#6A7282]">
          <Image src="/coursedetail/people.svg" width={17} height={17} alt="" />
          {course.studentCount.toLocaleString()}명
        </span>
        {/* TODO 등록일 */}
        {/* <span className="flex items-center gap-1.5 text-[#6A7282]">
          <Image src="/coursedetail/calendar.svg" width={17} height={17} alt="" />
          등록일 {course.createdAt}
        </span> */}
      </div>
    </div>
  )
}