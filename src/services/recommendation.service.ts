import { JobPostingRecommendationRequest, JobPostingRecommendationResponse, JobPostingRecommendationResult, AnalyzeResult } from "@/features/user/recommendations/types";

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
    const res = await fetch(
      `${API_BASE_URL}/recommendations/job-posting/${recommendationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );
 
    if (!res.ok) return null;
    return res.json();
  } catch {
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