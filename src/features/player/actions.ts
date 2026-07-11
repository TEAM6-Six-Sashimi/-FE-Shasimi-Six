'use server';

import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { AuthSessionError, handleAuthErrorResponse } from '@/features/auth/auth-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 학습 진행률(마지막 재생 위치) 저장
export async function saveSessionProgressAction(
  courseId: number,
  sessionId: number,
  lastPositionSeconds: number,
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(
    `${API_BASE_URL}/student/courses/${courseId}/sessions/${sessionId}/progress`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-USER-ID': String(user.id),
      },
      body: JSON.stringify({ lastPositionSeconds }),
    },
  );

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) throw new AuthSessionError(authMessage);

    const errorBody = await res.text().catch(() => '');
    console.error(`[saveSessionProgressAction] status=${res.status} body=${errorBody}`);
    throw new Error('학습 진행률 저장에 실패했습니다.');
  }
}
