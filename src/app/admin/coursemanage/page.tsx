import { cookies } from 'next/headers';
import {
  fetchAdminCourses,
  fetchAdminPendingCourses,
  fetchAdminRejectedCourses,
  fetchAdminPrivateCourses,
  fetchAdminCategories,
} from '@/services/admin.service';
import CourseManagePage from './_components/CourseManagePage';
import { fetchCategories } from '@/services/categories.service';

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const [
    allCourses,
    pendingCourses,
    rejectedCourses,
    privateCourses,
    courseCategories,
    adminCategories,
  ] = await Promise.all([
    fetchAdminCourses(accessToken),
    fetchAdminPendingCourses(accessToken),
    fetchAdminRejectedCourses(accessToken),
    fetchAdminPrivateCourses(accessToken),
    fetchCategories(), // 기존
    fetchAdminCategories(accessToken), // 관리자용
  ]);

  return (
    <CourseManagePage
      allCourses={allCourses}
      pendingCourses={pendingCourses}
      rejectedCourses={rejectedCourses}
      privateCourses={privateCourses}
      courseCategories={courseCategories}
      adminCategories={adminCategories}
      accessToken={accessToken}
    />
  );
}
