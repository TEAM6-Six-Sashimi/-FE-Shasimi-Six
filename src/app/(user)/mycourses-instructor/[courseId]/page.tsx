import { cookies } from 'next/headers';
import { fetchCourseDetail } from '@/services/course.service';
import { fetchCategories } from '@/services/categories.service';
import CourseDetailInstructor from '@/features/user/mycourses-instructor/components/CourseDetailInstructor';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const [course, categories] = await Promise.all([
    fetchCourseDetail(courseId, accessToken),
    fetchCategories(),
  ]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return <CourseDetailInstructor course={course} categories={categories} />;
}
