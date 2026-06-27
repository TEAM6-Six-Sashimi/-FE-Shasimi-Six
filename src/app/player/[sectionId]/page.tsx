import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchStudentCourseDetail } from '@/services/course.service';
import { fetchUserMe } from '@/services/user.service';
import PlayerPage from './components/PlayerPage';

interface Props {
  params: Promise<{ sectionId: string }>;
  searchParams: Promise<{ courseId?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { sectionId } = await params;
  const { courseId } = await searchParams;

  if (!courseId) {
    // courseId 없이는 강의 정보를 조회할 수 없으므로 강의 목록으로 돌려보냄
    redirect('/mycourses-student');
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') {
    redirect('/login');
  }

  const course = await fetchStudentCourseDetail(courseId, accessToken, String(user.id));

  if (!course) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center bg-[#F9FAFB] text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#F9FAFB]">
      <PlayerPage course={course} courseId={Number(courseId)} sessionId={Number(sectionId)} />
    </div>
  );
}