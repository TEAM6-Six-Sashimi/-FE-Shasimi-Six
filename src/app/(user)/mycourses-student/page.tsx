import { cookies } from 'next/headers';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { fetchStudentCourses } from '@/services/course.service';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import MyCoursesList from '@/features/user/mycourses-student/components/MyCoursesList';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function StudentMyCourseListPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <MyCoursesList courses={[]} />
      </div>
    );
  }

  try {
    const user = await fetchUserMeStrict(accessToken);
    const courses = await fetchStudentCourses(accessToken, String(user.id));

    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <MyCoursesList courses={courses} />
      </div>
    );
  } catch (error) {
    // 토큰은 있지만 세션이 죽은 상태 - 로그아웃 처리
    if (error instanceof UserMeAuthError) {
      const message = (await parseAuthErrorMessage(error.response)) ?? '다시 로그인해주세요.';
      return <SessionExpiredRedirect message={message} />;
    }
    throw error;
  }
}
