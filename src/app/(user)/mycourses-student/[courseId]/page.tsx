import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchStudentCourseDetail } from '@/services/course.service';
import CourseDetailPageOwned from '../../courses/[category]/[courseId]/_components/CourseDetailPageOwned';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function StudentCourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  const user = await fetchUserMe(accessToken);

  const course = await fetchStudentCourseDetail(courseId, accessToken, String(user.id));
 

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const enrollmentInfo = {
    enrollmentId: 0,
    courseId: course.courseId,
    progress: course.progressRate,
    enrolledAt: '',
  };

  return <CourseDetailPageOwned course={course} enrollmentInfo={enrollmentInfo} />;
}