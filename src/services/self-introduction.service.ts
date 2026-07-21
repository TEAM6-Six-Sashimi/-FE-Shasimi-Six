import {
  CoverLetterResponse,
  CoverLetterReviewDetail,
  CoverLetterReviewDetailResult,
  CoverLetterReviewResponse,
  CoverLetterReviewResult,
  CoverLetterSavePayload,
  LatestCoverLetterReviewResponse,
} from '@/features/user/self-introduction/types';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import { AuthSessionError } from '@/features/auth/errors';

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

    if (!res.ok) {
      // 페이지 렌더링 중 직접 호출되므로 쿠키를 지울 수 없음
      // 순수 파싱 버전으로 던지고, 쿠키 정리는 호출부의 SessionExpiredRedirect가 담당
      const authMessage = await parseAuthErrorMessage(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      return null;
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AuthSessionError) throw e;
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

    if (!res.ok) {
      const authMessage = await parseAuthErrorMessage(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      return null;
    }

    const data: LatestCoverLetterReviewResponse = await res.json();
    return data.review;
  } catch (e) {
    if (e instanceof AuthSessionError) throw e;
    return null;
  }
}

// 자기소개서 AI 첨삭 상세 결과 조회
export async function fetchCoverLetterReviewById(
  accessToken: string,
  reviewId: number,
): Promise<CoverLetterReviewDetailResult | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/cover-letters/reviews/${reviewId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      await handleAuthErrorResponse(res); // 동시 접속 등으로 세션이 끊긴 경우 쿠키 정리
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}
