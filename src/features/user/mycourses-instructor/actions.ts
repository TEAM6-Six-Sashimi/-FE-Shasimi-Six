'use server'

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { fetchUserMe } from '@/services/user.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function deleteCourseAction(courseId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') throw new Error('인증이 필요합니다.');

  const res = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-USER-ID': String(user.id),
    },
  });

  if (!res.ok) throw new Error('삭제 처리에 실패했습니다.');
  revalidatePath('/mycourses-instructor');
}