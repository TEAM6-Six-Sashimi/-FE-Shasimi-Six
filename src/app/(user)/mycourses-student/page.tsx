import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchStudentCourses } from '@/services/course.service';
import MyCoursesList from '@/features/user/mycourses-student/components/MyCoursesList';

export default async function StudentMyCourseListPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  console.log('accessToken:', accessToken ? accessToken.slice(0, 20) + '...' : '없음');

  const user = accessToken ? await fetchUserMe(accessToken) : null;
  console.log('user:', user);

  const courses = user ? await fetchStudentCourses(accessToken, String(user.id)) : [];
  console.log('courses:', courses);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <MyCoursesList courses={courses} />
    </div>
  );
}
