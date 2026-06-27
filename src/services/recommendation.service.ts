import { JobPostingRecommendationRequest, JobPostingRecommendationResponse } from "@/features/user/recommendations/types";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class RecommendationApiError extends Error {
  errorCode?: string;
  status?: number;
  constructor(message: string, errorCode?: string, status?: number) {
    super(message);
    this.errorCode = errorCode;
    this.status = status;
  }
}

export async function postJobPostingRecommendation(
  accessToken: string,
  body: JobPostingRecommendationRequest,
): Promise<JobPostingRecommendationResponse> {
  const res = await fetch(`${API_BASE_URL}/recommendations/job-posting`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorCode: string | undefined;
    let message = '채용공고 분석에 실패했습니다.';

    try {
      const errorBody = await res.json();
      errorCode = errorBody.errorCode;
      message = errorBody.message || message;
    } catch {
      // 본문이 JSON이 아닌 경우 기본 메시지 사용
    }

    console.error(
      `[postJobPostingRecommendation] status=${res.status} errorCode=${errorCode} message=${message}`,
    );
    throw new RecommendationApiError(message, errorCode, res.status);
  }

  return res.json();
}