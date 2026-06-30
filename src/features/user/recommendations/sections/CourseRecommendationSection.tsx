import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RecommendedCourse } from '../types';
import { CourseFromAPI } from '../../courses/types';

interface CourseRecommendationSectionProps {
  courses: RecommendedCourse[];
  courseDetails: CourseFromAPI[];
}

export default function CourseRecommendationSection({
  courses,
  courseDetails,
}: CourseRecommendationSectionProps) {
  // courseId 기준으로 courseDetails에서 빠르게 찾기 위한 맵
  const courseDetailMap = new Map(courseDetails.map((c) => [c.courseId, c]));

  return (
    <section className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#1E2125] mb-5">
        <Image src="/ai-recommendation/lectureinfo-active.svg" alt="" width={18} height={18} /> 추천
        자격증 기반 강의 정보
      </h2>

      <div className="flex flex-col gap-3">
        {courses.map((course) => {
          const detail = courseDetailMap.get(course.courseId);

          return (
            <div
              key={course.courseId}
              className="flex items-center gap-4 border border-[#E5E7EB] rounded-xl p-4"
            >
              <div className="relative w-30 h-20 rounded-lg overflow-hidden bg-[#E5E7EB] shrink-0">
                {detail?.thumbnail && (
                  <Image
                    src={detail.thumbnail}
                    alt={course.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] font-bold text-[#1E2125] truncate">{course.title}</p>
                {detail?.instructorName && (
                  <p className="text-[12.5px] text-[#6A7282] mt-0.5">{detail.instructorName}</p>
                )}
                {detail?.categoryName && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FFEBEB] text-[#FF5E5E] text-[11.5px] font-medium">
                    {detail.categoryName}
                  </span>
                )}
              </div>
              <div className="pt-9">
                <Link
                  href={
                    detail?.categoryName
                      ? `/courses/${encodeURIComponent(detail.categoryName)}/${course.courseId}`
                      : `/courses/${course.courseId}`
                  }
                >
                  <Button
                    variant="outline"
                    className="py-4 px-4 border-[#FF5E5E] text-[#FF5E5E] text-[12px] font-semibold hover:bg-[#FFEBEB] hover:text-[#FF5E5E] cursor-pointer shrink-0"
                  >
                    강의 바로가기
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
