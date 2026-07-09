import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchCourseDetail } from '@/services/course.service';
import PlayerPage from '@/features/player/components/PlayerPage';

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ courseId?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { courseId } = await searchParams;

  if (!courseId) {
    // courseId 없이는 강의 정보를 조회할 수 없으므로 강의 목록으로 돌려보냄
    redirect('/mycourses-student');
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // 강의 상세 조회 (viewerType=ENROLLED 기대 - 비로그인/미구매자는 영상 재생 페이지 접근 의미 없음)
  const course = await fetchCourseDetail(courseId, accessToken);

  if (!course) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center bg-[#F9FAFB] text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#F9FAFB]">
      <PlayerPage course={course} courseId={Number(courseId)} sessionId={Number(sessionId)} />
    </div>
  );
}
