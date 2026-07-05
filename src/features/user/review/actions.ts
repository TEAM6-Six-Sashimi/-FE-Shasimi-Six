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

export async function createReviewAction(
  courseId: number,
  body: CreateReviewRequest,
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    await createReview(accessToken, user.id, courseId, body);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '리뷰 등록에 실패했습니다.',
    };
  }
}

export async function deleteReviewAction(
  courseId: number,
  reviewId: number,
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    await deleteReview(accessToken, user.id, courseId, reviewId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '수강평 삭제에 실패했습니다.',
    };
  }
}

export async function reportReviewAction(
  reviewId: number,
  body: ReportReviewRequest,
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const { accessToken } = await getAuthOrThrow();
    await reportReview(accessToken, reviewId, body);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '신고 처리에 실패했습니다.',
    };
  }
}
