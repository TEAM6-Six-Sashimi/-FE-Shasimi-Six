'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { fetchUserMe } from '@/services/user.service';
import type { CreateCourseRequest } from '@/features/user/mycourses-instructor/types';
import type { UpdateCourseRequest } from '@/features/user/mycourses-instructor/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 신규 강의 등록
export async function createCourseAction(payload: CreateCourseRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') throw new Error('인증이 필요합니다.');

  const res = await fetch(`${API_BASE_URL}/instructor/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-USER-ID': String(user.id),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || '강의 등록에 실패했습니다.');
  }
}

// 등록한 강의 수정
export async function updateCourseAction(courseId: number, payload: UpdateCourseRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') throw new Error('인증이 필요합니다.');

  const res = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-USER-ID': String(user.id),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || '강의 수정에 실패했습니다.');
  }
}

// 등록한 강의 삭제
export async function deleteCourseAction(courseId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') throw new Error('인증이 필요합니다.');

  const res = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-USER-ID': String(user.id),
    },
  });

  if (!res.ok) throw new Error('삭제 처리에 실패했습니다.');
  revalidatePath('/mycourses-instructor');
}
