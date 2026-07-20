'use server';

import { cookies } from 'next/headers';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { AuthSessionError, handleAuthErrorResponse } from '@/features/auth/auth-error';
import {
  createReview,
  deleteReview,
  reportReview,
  ReviewApiError,
  CreateReviewRequest,
  ReportReviewRequest,
} from '@/services/review.service';
import { MaintenanceError } from '@/services/maintenance.service';

function isAuthError(error: unknown): boolean {
  return error instanceof AuthSessionError || (error instanceof ReviewApiError && !!error.isAuthError);
}

async function getAuthOrThrow() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  try {
    const user = await fetchUserMeStrict(accessToken);
    return { accessToken, user };
  } catch (error) {
    if (error instanceof UserMeAuthError) {
      const authMessage = await handleAuthErrorResponse(error.response);
      if (authMessage) throw new AuthSessionError(authMessage);
    }
    throw new Error('로그인이 필요합니다.');
  }
}

export async function createReviewAction(
  courseId: number,
  body: CreateReviewRequest,
): Promise<
  | { success: true }
  | { success: false; message: string; authError?: true; maintenance?: true }
> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    await createReview(accessToken, user.id, courseId, body);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '리뷰 등록에 실패했습니다.',
      authError: isAuthError(error) || undefined,
      maintenance: error instanceof MaintenanceError || undefined,
    };
  }
}

export async function deleteReviewAction(
  courseId: number,
  reviewId: number,
): Promise<
  | { success: true }
  | { success: false; message: string; authError?: true; maintenance?: true }
> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    await deleteReview(accessToken, user.id, courseId, reviewId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '수강평 삭제에 실패했습니다.',
      authError: isAuthError(error) || undefined,
      maintenance: error instanceof MaintenanceError || undefined,
    };
  }
}

export async function reportReviewAction(
  reviewId: number,
  body: ReportReviewRequest,
): Promise<
  | { success: true }
  | { success: false; message: string; authError?: true; maintenance?: true }
> {
  try {
    const { accessToken } = await getAuthOrThrow();
    await reportReview(accessToken, reviewId, body);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '신고 처리에 실패했습니다.',
      authError: isAuthError(error) || undefined,
      maintenance: error instanceof MaintenanceError || undefined,
    };
  }
}
