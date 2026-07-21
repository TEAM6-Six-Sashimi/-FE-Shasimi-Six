'use server';

import { cookies } from 'next/headers';
import {
  saveResume,
  updateResume,
  fetchMyResume,
  requestAiReview,
  fetchLatestAiReview,
} from '@/services/resume.service';
import { LatestAiReviewDetail, ResumePayload, SavedResume } from './types';

export async function saveResumeAction(payload: ResumePayload): Promise<{
  success: boolean;
  resumeId?: number;
  authError?: true;
  maintenance?: true;
  validationError?: true;
  message?: string;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false };

  const result = await saveResume(accessToken, payload);
  if (!result) return { success: false };
  if ('authError' in result) {
    return { success: false, authError: true, message: result.message };
  }
  if ('maintenance' in result) {
    return { success: false, maintenance: true, message: result.message };
  }
  if ('validationError' in result) {
    return { success: false, validationError: true };
  }

  return { success: true, resumeId: result.resumeId };
}

// 기존에 저장된 이력서가 있으면 수정(PATCH), 없으면 신규 작성(POST)
export async function updateResumeAction(
  resumeId: number,
  payload: ResumePayload,
): Promise<{
  success: boolean;
  authError?: true;
  maintenance?: true;
  validationError?: true;
  message?: string;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false };

  return updateResume(accessToken, resumeId, payload);
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

// 이력서 AI 평가 결과 중 최신 결과 1개 조회
export async function fetchLatestAiReviewAction(
  resumeId: number,
): Promise<LatestAiReviewDetail | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchLatestAiReview(accessToken, resumeId);
}
