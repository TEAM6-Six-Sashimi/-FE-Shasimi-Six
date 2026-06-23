// 일반 사용자 - 구매 후
import CourseDetailContent from '@/features/user/courses/components/CourseDetailContent';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import StudentOwnedButtons from '@/features/user/courses/components/sidebar-buttons/StudentOwnedButtons';
import { CourseDetailFromAPI, EnrollmentInfo } from '@/features/user/courses/types';
import { Category } from '@/features/categories/types';

interface CourseDetailPageOwnedProps {
  course: CourseDetailFromAPI;
  categories: Category[];
  enrollmentInfo: EnrollmentInfo;
}

export default function CourseDetailPageOwned({
  course,
  categories,
  enrollmentInfo,
}: CourseDetailPageOwnedProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          <CourseDetailContent
            course={course}
            categories={categories}
            tabs={['curriculum', 'instructor', 'reviews']}
            showProgress={true}
            allSessionsPlayable={true}
            enrollmentInfo={enrollmentInfo}
            canWriteReview={true}
          />
          <div className="w-72 shrink-0 sticky top-4">
            <CourseDetailSidebar
              course={course}
              actionSlot={
                <StudentOwnedButtons courseId={course.courseId} enrollmentInfo={enrollmentInfo} />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}