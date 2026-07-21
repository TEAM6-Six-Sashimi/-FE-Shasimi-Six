'use server';

import { cookies } from 'next/headers';
import { fetchCourseDetail } from '@/services/course.service';

export interface ResumeSessionResult {
  sessionId: number;
  lastPositionSeconds: number;
}

// 이어보기: 미완료 세션 중 sessionOrder가 가장 작은 것(모두 완료됐으면 첫 세션 반환)
export async function getResumeSessionAction(
  courseId: number,
): Promise<ResumeSessionResult | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const course = await fetchCourseDetail(String(courseId), accessToken);
  if (!course || course.sessions.length === 0) return null;

  const sorted = [...course.sessions].sort((a, b) => a.sessionOrder - b.sessionOrder);
  const next = sorted.find((s) => !s.sessionCompleted) ?? sorted[0];

  return {
    sessionId: next.sessionId,
    lastPositionSeconds: next.sessionCompleted ? 0 : (next.lastPositionSeconds ?? 0),
  };
}
