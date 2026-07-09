'use server';

import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchStudentCourses } from '@/services/course.service';

// 구매 전 수강 여부 확인: 내 강의 목록에 이미 있는 강의인지 비교
export async function checkAlreadyEnrolledAction(courseId: number): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  if (!accessToken) return false;

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') return false;

  const myCourses = await fetchStudentCourses(accessToken, String(user.id));
  return myCourses.some((c) => c.courseId === courseId);
}
