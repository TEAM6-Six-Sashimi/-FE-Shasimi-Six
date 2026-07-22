import CourseDetailContent from '@/features/user/courses/components/CourseDetailContent';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import { Category } from '@/features/categories/types';
import { resolveCourseViewOptions } from '@/lib/course-view-options';
import CourseActionSlot from '@/features/user/courses/components/CourseActionSlot';

interface CourseDetailPageProps {
  course: CourseDetailFromAPI;
  categories: Category[];
  currentUserLoginId?: string | null;
}

export default function CourseDetailPage({
  course,
  categories,
  currentUserLoginId,
}: CourseDetailPageProps) {
  const { showProgress, allSessionsPlayable, reviewMode, actionType } =
    resolveCourseViewOptions(course);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <CourseDetailContent
            course={course}
            categories={categories}
            showProgress={showProgress}
            allSessionsPlayable={allSessionsPlayable}
            reviewMode={reviewMode}
            currentUserLoginId={currentUserLoginId}
          />
          <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-4 z-30">
            <CourseDetailSidebar
              course={course}
              actionSlot={<CourseActionSlot course={course} actionType={actionType} />}
              // PUBLIC만 가격 노출, 나머지(ENROLLED/OWNER/ADMIN)는 이미 결제했거나 가격이 의미 없는 입장이므로 숨김
              showPrice={course.viewerType === 'PUBLIC'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
