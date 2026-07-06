import CourseDetailContent from '@/features/user/courses/components/CourseDetailContent';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import { Category } from '@/features/categories/types';
import { resolveCourseViewOptions } from '@/lib/course-view-options';
import CourseActionSlot from '@/features/user/courses/components/CourseActionSlot';

interface CourseDetailPageProps {
  course: CourseDetailFromAPI;
  categories: Category[];
  /** 현재 로그인한 사용자의 loginId - 본인 리뷰 판별(삭제 버튼/정렬)에 사용 */
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
        <div className="flex gap-10 items-start">
          <CourseDetailContent
            course={course}
            categories={categories}
            showProgress={showProgress}
            allSessionsPlayable={allSessionsPlayable}
            reviewMode={reviewMode}
            currentUserLoginId={currentUserLoginId}
          />
          <div className="w-72 shrink-0 sticky top-4 z-30">
            <CourseDetailSidebar
              course={course}
              actionSlot={<CourseActionSlot course={course} actionType={actionType} />}
              // PUBLIC만 가격 노출, 나머지(ENROLLED/OWNER/ADMIN)는 이미 결제했거나
              // 가격이 의미 없는 입장이므로 숨김
              showPrice={course.viewerType === 'PUBLIC'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}