import {
  CoverLetterResponse,
  CoverLetterReviewDetail,
  CoverLetterReviewResponse,
  CoverLetterReviewResult,
  CoverLetterSavePayload,
  LatestCoverLetterReviewResponse,
} from '@/features/user/self-introduction/types';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 내 자기소개서 조회 (작성 전이어도 기본 문항 목록을 빈 content로 반환)
export async function fetchMyCoverLetter(accessToken: string): Promise<CoverLetterResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cover-letters`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export type SaveCoverLetterResult =
  | { success: true; data: CoverLetterResponse }
  | { success: false; authError?: true; message?: string };

// 자기소개서 저장
export async function saveCoverLetter(
  accessToken: string,
  payload: CoverLetterSavePayload,
): Promise<SaveCoverLetterResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/cover-letters`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) return { success: false, authError: true, message: authMessage };
      return { success: false };
    }

    const data: CoverLetterResponse = await res.json();
    return { success: true, data };
  } catch {
    return { success: false };
  }
}

// 저장된 자기소개서 기준 AI 첨삭 요청
export async function requestCoverLetterReview(
  accessToken: string,
): Promise<CoverLetterReviewResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/cover-letters/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) {
        return {
          success: false,
          error: { errorCode: 'AUTH_SESSION_EXPIRED', message: authMessage, authError: true },
        };
      }

      const errorBody = await res.json().catch(() => ({}));
      return {
        success: false,
        error: {
          errorCode: errorBody.errorCode ?? 'UNKNOWN',
          message: errorBody.message ?? 'AI 평가 요청에 실패했습니다.',
        },
      };
    }

    const data: CoverLetterReviewResult = await res.json();
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: { errorCode: 'NETWORK_ERROR', message: '네트워크 오류가 발생했습니다.' },
    };
  }
}

// 가장 최근 자기소개서 첨삭 결과 조회 (없으면 null)
export async function fetchLatestCoverLetterReview(
  accessToken: string,
): Promise<CoverLetterReviewDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cover-letters/reviews/latest/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: LatestCoverLetterReviewResponse = await res.json();
    return data.review;
  } catch {
    return null;
  }
}
