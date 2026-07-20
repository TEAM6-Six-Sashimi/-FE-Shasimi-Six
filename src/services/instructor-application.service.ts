import { MyInstructorApplication, MyInstructorApplicationDetail } from '@/features/mypage/types';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import { AuthSessionError } from '@/features/auth/errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 나의 강사 지원 내역 목록 조회
export async function fetchMyInstructorApplications(
  userId: number,
  accessToken: string,
): Promise<MyInstructorApplication[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members/${userId}/instructor-applications`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      // 페이지 렌더링 중(Server Component) 직접 호출되므로 쿠키를 지울 수 없다.
      // 순수 파싱 버전으로 던지고, 쿠키 정리는 호출부의 SessionExpiredRedirect가 담당한다.
      const authMessage = await parseAuthErrorMessage(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      return [];
    }
    return res.json();
  } catch (e) {
    if (e instanceof AuthSessionError) throw e;
    return [];
  }
}

// 나의 강사 지원 상세 (반려 사유 포함) 조회
export async function fetchMyInstructorApplicationDetail(
  userId: number,
  applicationId: number,
  accessToken: string,
): Promise<MyInstructorApplicationDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/members/${userId}/instructor-applications/${applicationId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      const authMessage = await parseAuthErrorMessage(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      return null;
    }
    return res.json();
  } catch (e) {
    if (e instanceof AuthSessionError) throw e;
    return null;
  }
}
