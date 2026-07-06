import {
  ResumePayload,
  AiReviewResult,
  SavedResume,
  AiReviewResponse,
} from '@/features/user/resume/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 이력서 신규 작성
export async function saveResume(
  accessToken: string,
  payload: ResumePayload,
): Promise<{ resumeId: number } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return null;
    }

    const data = await res.json();

    return data;
  } catch (e) {
    return null;
  }
}

// 이력서 수정
export async function updateResume(
  accessToken: string,
  resumeId: number,
  payload: ResumePayload,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch {
    return false;
  }
}

// 내 이력서 조회
export async function fetchMyResume(accessToken: string): Promise<SavedResume | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/resumes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: SavedResume = await res.json();
    return data;
  } catch {
    return null;
  }
}

// AI 이력서 평가 요청
export async function requestAiReview(
  accessToken: string,
  resumeId: number,
): Promise<AiReviewResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/ai-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return {
        success: false,
        error: {
          errorCode: errorBody.errorCode ?? 'UNKNOWN',
          message: errorBody.message ?? '평가 요청에 실패했습니다.',
        },
      };
    }

    const data: AiReviewResult = await res.json();
    return { success: true, data };
  } catch {
    return {
      success: false,
      error: { errorCode: 'NETWORK_ERROR', message: '네트워크 오류가 발생했습니다.' },
    };
  }
}
