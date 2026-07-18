import { handleAuthErrorResponse } from '@/features/auth/auth-error';
import { parseMaintenanceMessage, MaintenanceError } from '@/services/maintenance.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateReviewRequest {
  rating: number;
  content?: string;
}

export interface ReportReviewRequest {
  category: 'ABUSE' | 'SPAM' | 'FALSE_INFO' | 'OTHER';
  reason?: string;
}

export class ReviewApiError extends Error {
  status?: number;
  isAuthError?: boolean;
  constructor(message: string, status?: number, isAuthError?: boolean) {
    super(message);
    this.status = status;
    this.isAuthError = isAuthError;
  }
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

async function parseErrorCode(res: Response): Promise<string | undefined> {
  try {
    const body = await res.json();
    return body.errorCode;
  } catch {
    return undefined;
  }
}

// 수강평 등록
export async function createReview(
  accessToken: string,
  userId: number,
  courseId: number,
  body: CreateReviewRequest,
) {
  const res = await fetch(`${API_BASE_URL}/api/users/${userId}/courses/${courseId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) throw new ReviewApiError(authMessage, res.status, true);

    const maintenanceMessage = await parseMaintenanceMessage(res);
    if (maintenanceMessage) throw new MaintenanceError(maintenanceMessage);

    // REVIEW_001 -> 이미 해당 강의에 리뷰를 작성한 경우
    const errorCode = await parseErrorCode(res.clone());
    if (errorCode === 'REVIEW_001') {
      throw new ReviewApiError('수강평이 이미 등록되어 있습니다.', res.status);
    }

    const message = await parseErrorMessage(res, '리뷰 등록에 실패했습니다.');
    throw new ReviewApiError(message, res.status);
  }
}

// 수강평 삭제 (본인 작성 글만 가능)
export async function deleteReview(
  accessToken: string,
  userId: number,
  courseId: number,
  reviewId: number,
) {
  const res = await fetch(
    `${API_BASE_URL}/api/users/${userId}/courses/${courseId}/reviews/${reviewId}/delete`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) throw new ReviewApiError(authMessage, res.status, true);

    const message = await parseErrorMessage(res, '리뷰 삭제에 실패했습니다.');
    throw new ReviewApiError(message, res.status);
  }
}

// 수강평 신고
export async function reportReview(
  accessToken: string,
  reviewId: number,
  body: ReportReviewRequest,
) {
  const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/reports`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) throw new ReviewApiError(authMessage, res.status, true);

    let message = '신고 처리에 실패했습니다.';
    if (res.status === 403) message = '본인이 작성한 수강평은 신고할 수 없습니다.';
    else if (res.status === 404) message = '수강평을 찾을 수 없습니다.';
    else if (res.status === 409) message = '이미 신고한 수강평입니다.';
    else message = await parseErrorMessage(res, message);
    throw new ReviewApiError(message, res.status);
  }
}
