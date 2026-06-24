import CourseDetailContent from '@/features/user/courses/components/CourseDetailContent';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import NotOwnedButtons from '@/features/user/courses/components/sidebar-buttons/NotOwnedButtons';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import { Category } from '@/features/categories/types';

interface CourseDetailPageProps {
  course: CourseDetailFromAPI;
  categories: Category[];
}

export default function CourseDetailPage({ course, categories }: CourseDetailPageProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          <CourseDetailContent
            course={course}
            categories={categories}
            showProgress={false}
            allSessionsPlayable={false}
            reviewMode="readonly"
          />
          <div className="w-72 shrink-0 sticky top-4">
            <CourseDetailSidebar course={course} actionSlot={<NotOwnedButtons course={course} />} />
          </div>
        </div>
      </div>
    </div>
  );
}