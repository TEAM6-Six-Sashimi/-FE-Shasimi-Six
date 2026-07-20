import {
  JobPostingRecommendationRequest,
  JobPostingRecommendationResponse,
  JobPostingRecommendationResult,
  AnalyzeResult,
  LatestJobPostingRecommendation,
  LatestJobPostingRecommendationResponse,
} from '@/features/user/recommendations/types';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';
import { throwIfAuthSessionError } from '@/features/auth/auth-error-messages';
import { AuthSessionError } from '@/features/auth/errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postJobPostingRecommendation(
  accessToken: string,
  body: JobPostingRecommendationRequest,
): Promise<AnalyzeResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/job-posting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // 세션이 죽은 경우(다른 기기 로그인 등) - 안내 메시지 + authError 플래그로 구분
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
          message: errorBody.message ?? '분석 요청에 실패했습니다.',
        },
      };
    }

    const data: JobPostingRecommendationResponse = await res.json();
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: { errorCode: 'NETWORK_ERROR', message: '네트워크 오류가 발생했습니다.' },
    };
  }
}

// 분석 결과 상세 조회
export async function fetchJobPostingRecommendation(
  accessToken: string,
  recommendationId: number,
): Promise<JobPostingRecommendationResult | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/job-posting/${recommendationId}`, {
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
    return res.json();
  } catch {
    return null;
  }
}

// 채용공고 분석 결과 중 최신 결과 1개 조회
export async function fetchLatestJobPostingRecommendation(
  accessToken: string,
): Promise<LatestJobPostingRecommendation | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/recommendations/job-posting/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      await throwIfAuthSessionError(res); // 동시 접속 등으로 세션이 끊긴 경우
      return null;
    }

    const data: LatestJobPostingRecommendationResponse = await res.json();
    return data.recommendation;
  } catch (e) {
    if (e instanceof AuthSessionError) throw e;
    return null;
  }
}

// 입력한 URL이 실제로 접속 가능한지 확인 (채용공고 여부 검증 아님, 단순 접근 가능 여부)
export async function checkUrlReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok || (res.status >= 200 && res.status < 400);
  } catch {
    return false;
  }
}
