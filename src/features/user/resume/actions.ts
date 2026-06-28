'use server';

import { cookies } from 'next/headers';
import {
  saveResume,
  updateResume,
  fetchMyResume,
  requestAiReview,
  SavedResume,
} from '@/services/resume.service';
import { ResumePayload } from './types';

export async function saveResumeAction(
  payload: ResumePayload,
): Promise<{ success: boolean; resumeId?: number }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false };

  const result = await saveResume(accessToken, payload);
  if (!result) return { success: false };

  return { success: true, resumeId: result.resumeId };
}

// 기존에 저장된 이력서가 있으면 수정(PATCH), 없으면 신규 작성(POST)
export async function updateResumeAction(
  resumeId: number,
  payload: ResumePayload,
): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false };

  const success = await updateResume(accessToken, resumeId, payload);
  return { success };
}

export async function fetchMyResumeAction(): Promise<SavedResume | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchMyResume(accessToken);
}

export async function requestAiReviewAction(resumeId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      success: false as const,
      error: { errorCode: 'NO_TOKEN', message: '로그인이 필요합니다.' },
    };
  }

  return requestAiReview(accessToken, resumeId);
}
