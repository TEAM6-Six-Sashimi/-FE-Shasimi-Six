import { cookies } from 'next/headers';
import {
  fetchAdminCourses,
  fetchAdminPendingCourses,
  fetchAdminRejectedCourses,
  fetchAdminCategories,
} from '@/services/admin.service';
import CourseManagePage from './_components/CourseManagePage';
import { fetchCategories } from '@/services/categories.service';

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const [allCourses, pendingCourses, rejectedCourses, courseCategories, adminCategories] =
    await Promise.all([
      fetchAdminCourses(accessToken),
      fetchAdminPendingCourses(accessToken),
      fetchAdminRejectedCourses(accessToken),
      fetchCategories(), // 기존
      fetchAdminCategories(accessToken), // 관리자용
    ]);
  return (
    <CourseManagePage
      allCourses={allCourses}
      pendingCourses={pendingCourses}
      rejectedCourses={rejectedCourses}
      courseCategories={courseCategories}
      adminCategories={adminCategories}
    />
  );
}
