'use server';

import { cookies } from 'next/headers';
import {
  fetchCoverLetterReviewById,
  fetchLatestCoverLetterReview,
  fetchMyCoverLetter,
  requestCoverLetterReview,
  saveCoverLetter,
} from '@/services/self-introduction.service';
import {
  CoverLetterResponse,
  CoverLetterReviewDetail,
  CoverLetterReviewDetailResult,
  CoverLetterSavePayload,
} from './types';

export async function fetchMyCoverLetterAction(): Promise<CoverLetterResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchMyCoverLetter(accessToken);
}

export async function saveCoverLetterAction(payload: CoverLetterSavePayload) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false as const };

  return saveCoverLetter(accessToken, payload);
}

export async function requestCoverLetterReviewAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      success: false as const,
      error: { errorCode: 'NO_TOKEN', message: '로그인이 필요합니다.' },
    };
  }

  return requestCoverLetterReview(accessToken);
}

export async function fetchLatestCoverLetterReviewAction(): Promise<CoverLetterReviewDetail | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchLatestCoverLetterReview(accessToken);
}

export async function fetchCoverLetterReviewByIdAction(
  reviewId: number,
): Promise<CoverLetterReviewDetailResult | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchCoverLetterReviewById(accessToken, reviewId);
}
