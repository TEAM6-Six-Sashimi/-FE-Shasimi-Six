import { cookies } from 'next/headers';
import { fetchCourseDetail } from '@/services/course.service';
import CourseDetailInstructor from '@/features/user/mycourses-instructor/components/CourseDetailInstructor';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;
 
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  const course = await fetchCourseDetail(courseId, accessToken);
 
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }
 
  return <CourseDetailInstructor course={course} />;
}
 