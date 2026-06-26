import { ResumePayload, AiReviewResult } from "@/features/user/resume/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 이력서 작성/저장
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
      const errorText = await res.text();
      console.log('saveResume 실패 status:', res.status);   // ← 추가
      console.log('saveResume 실패 응답:', errorText);        // ← 추가
      return null;
    }
    return res.json();
  } catch (e) {
    console.log('saveResume catch 에러:', e);  // ← 추가
    return null;
  }
}

// 내 이력서 조회 (저장 여부 확인 + 초기 데이터 로드용)
export async function fetchMyResume(accessToken: string): Promise<ResumePayload | null> {
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
    return res.json();
  } catch {
    return null;
  }
}

// AI 이력서 평가 요청
export async function requestAiReview(
  accessToken: string,
  resumeId: number,
): Promise<AiReviewResult | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/ai-review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
 
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}