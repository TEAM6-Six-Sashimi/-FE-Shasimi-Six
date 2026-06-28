'use server';

import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import {
  createReview,
  deleteReview,
  reportReview,
  CreateReviewRequest,
  ReportReviewRequest,
} from '@/services/review.service';

async function getAuthOrThrow() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') {
    throw new Error('로그인이 필요합니다.');
  }
  return { accessToken, user };
}

export async function createReviewAction(courseId: number, body: CreateReviewRequest) {
  const { accessToken, user } = await getAuthOrThrow();
  await createReview(accessToken, user.id, courseId, body);
}

export async function deleteReviewAction(courseId: number, reviewId: number) {
  const { accessToken, user } = await getAuthOrThrow();
  await deleteReview(accessToken, user.id, courseId, reviewId);
}

export async function reportReviewAction(reviewId: number, body: ReportReviewRequest) {
  const { accessToken } = await getAuthOrThrow();
  await reportReview(accessToken, reviewId, body);
}