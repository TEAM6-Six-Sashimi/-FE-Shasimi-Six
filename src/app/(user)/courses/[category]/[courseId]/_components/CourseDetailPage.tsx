import CourseDetailContent from '@/features/user/courses/components/CourseDetailContent';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import NotOwnedButtons from '@/features/user/courses/components/sidebar-buttons/NotOwnedButtons';
import { CourseDetailFromAPI } from '@/features/user/courses/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CourseDetailPageProps {
  course: CourseDetailFromAPI;
}


function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
}

export default function CourseDetailPage({ course }: CourseDetailPageProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          <CourseDetailContent
            course={course}
            tabs={['curriculum', 'instructor', 'reviews']}
            showProgress={false}
            allSessionsPlayable={false}
            canWriteReview={false}
          />
          <div className="w-72 shrink-0 sticky top-4">
            <CourseDetailSidebar course={course} actionSlot={<NotOwnedButtons course={course} />} />
          </div>
        </div>
      </div>
    </div>
  );
}