import { cookies } from 'next/headers';
import {
  fetchAdminCourses,
  fetchAdminPendingCourses,
  fetchAdminRejectedCourses,
} from '@/services/admin.service';
import { fetchCategories } from '@/services/categories.service';
import CourseManagePage from './_components/CourseManagePage';

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const [allCourses, pendingCourses, rejectedCourses, categories] = await Promise.all([
    fetchAdminCourses(accessToken),
    fetchAdminPendingCourses(accessToken),
    fetchAdminRejectedCourses(accessToken),
    fetchCategories(),
  ]);

  return (
    <CourseManagePage
      allCourses={allCourses}
      pendingCourses={pendingCourses}
      rejectedCourses={rejectedCourses}
      categories={categories}
    />
  );
}
