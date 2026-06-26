import CourseDetailContent from "@/features/user/courses/components/CourseDetailContent";
import CourseDetailSidebar from "@/features/user/courses/components/CourseDetailSidebar";
import { CourseDetailFromAPI } from "@/features/user/courses/types";
import { Category } from "@/features/categories/types";

interface PendingCourseDetailProps {
    course: CourseDetailFromAPI;
    categories: Category[];
}

export default function PendingCourseDetail({
    course, categories
}: PendingCourseDetailProps) {
    return (
        <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          <CourseDetailContent
            course={course}
            categories={categories}
            showProgress={false}
            allSessionsPlayable={true}
            reviewMode="no-reviews"
          />
          <div className="w-72 shrink-0 sticky top-4">
            {/* 승인/반려 버튼은 아직 미연동 - 버튼 영역 없이 썸네일+정보박스만 표시 */}
            <CourseDetailSidebar course={course} actionSlot={null} />
          </div>
        </div>
      </div>
    </div>
    )
}