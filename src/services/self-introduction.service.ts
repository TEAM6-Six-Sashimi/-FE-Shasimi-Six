import { CoverLetterResponse, CoverLetterSavePayload } from '@/features/user/self-introduction/types';
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

      const errorBody = await res.json().catch(() => ({}));
      console.error(
        `[saveCoverLetter] status=${res.status} errorCode=${errorBody.errorCode ?? '-'} traceId=${errorBody.traceId ?? '-'} message=${errorBody.message ?? '-'}`,
      );
      return { success: false, message: errorBody.message };
    }

    const data: CoverLetterResponse = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('[saveCoverLetter] request failed:', error);
    return { success: false };
  }
}
