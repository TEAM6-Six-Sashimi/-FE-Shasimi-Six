'use server'

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function approveCourseAction(courseId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/approve`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('승인 처리에 실패했습니다.');
}

export async function rejectCourseAction(courseId: number, rejectReason: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/reject`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rejectReason }),
  });

  if (!res.ok) throw new Error('반려 처리에 실패했습니다.');
}