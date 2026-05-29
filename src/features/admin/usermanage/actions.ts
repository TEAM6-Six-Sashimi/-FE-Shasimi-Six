'use server'

import { cookies } from 'next/headers';

const API_BASE_URL = 'http://localhost:8080';

export async function approveInstructorAction(applicationId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/api/members/instructor-applications/${applicationId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('승인 처리에 실패했습니다.');
}

export async function rejectInstructorAction(applicationId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/api/members/instructor-applications/${applicationId}/reject`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('반려 처리에 실패했습니다.');
}