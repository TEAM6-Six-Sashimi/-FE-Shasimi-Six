'use server';

import { cookies } from 'next/headers';
import { InstructorApplicationDetail } from './types';
import { fetchInstructorApplicationDetail } from '@/services/admin.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function approveInstructorAction(applicationId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(
    `${API_BASE_URL}/api/members/instructor-applications/${applicationId}/approve`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!res.ok) throw new Error('승인 처리에 실패했습니다.');
}

export async function rejectInstructorAction(applicationId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(
    `${API_BASE_URL}/api/members/instructor-applications/${applicationId}/reject`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!res.ok) throw new Error('반려 처리에 실패했습니다.');
}

export async function getApplicationDetailAction(
  applicationId: number,
): Promise<InstructorApplicationDetail | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  return fetchInstructorApplicationDetail(accessToken, applicationId);
}
