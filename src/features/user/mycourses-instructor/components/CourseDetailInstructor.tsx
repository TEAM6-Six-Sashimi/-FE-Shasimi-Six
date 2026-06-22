// 강사 본인 강의
import CourseDetailContent from '@/features/user/courses/components/CourseDetailContent';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import InstructorButtons from '@/features/user/courses/components/sidebar-buttons/InstructorButtons';
import { CourseDetailFromAPI } from '@/features/user/courses/types';

interface CourseDetailInstructorProps {
  course: CourseDetailFromAPI;
}

export default function CourseDetailInstructor({ course }: CourseDetailInstructorProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          <CourseDetailContent
            course={course}
            tabs={['curriculum', 'instructor']}
            showProgress={false}
            allSessionsPlayable={true}
            canWriteReview={false}
          />
          <div className="w-72 shrink-0 sticky top-4">
            <CourseDetailSidebar
              course={course}
              actionSlot={<InstructorButtons courseId={course.courseId} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}