import {
  CoursePaymentHistoryResponse,
  SubscriptionPaymentHistoryResponse,
  CancelSubscriptionResponse,
  SubscriptionMeResponse,
} from '@/features//mypage/types';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import { AuthSessionError } from '@/features/auth/errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 결제 내역
export async function fetchCoursePaymentHistory(
  accessToken: string,
): Promise<CoursePaymentHistoryResponse> {
  const res = await fetch(`${API_BASE_URL}/payments/history`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    // fetchCoursePaymentHistory는 페이지 렌더링 중(Server Component) 직접 호출되므로 쿠키를 지울 수 없음
    // 순수 파싱 버전으로 던지고, 쿠키 정리는 호출부의 SessionExpiredRedirect가 담당
    const authMessage = await parseAuthErrorMessage(res);
    if (authMessage) throw new AuthSessionError(authMessage);

    const errorBody = await res.text().catch(() => '');
    console.error(`[fetchCoursePaymentHistory] status=${res.status} body=${errorBody}`);
    return { items: [] };
  }

  return res.json();
}

export async function fetchSubscriptionPaymentHistory(
  accessToken: string,
  page = 0,
  size = 10,
): Promise<SubscriptionPaymentHistoryResponse> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });

  const res = await fetch(`${API_BASE_URL}/subscriptions/payments?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const authMessage = await parseAuthErrorMessage(res);
    if (authMessage) throw new AuthSessionError(authMessage);

    const errorBody = await res.text().catch(() => '');
    console.error(`[fetchSubscriptionPaymentHistory] status=${res.status} body=${errorBody}`);
    return { items: [], page: 0, size, totalElements: 0, totalPages: 0 };
  }

  return res.json();
}

// 현재 구독 상태 조회 (해지 버튼 노출 여부 / 만료일 표시 판단용)
export async function fetchSubscriptionMe(
  accessToken: string,
): Promise<SubscriptionMeResponse | null> {
  const res = await fetch(`${API_BASE_URL}/subscriptions/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const authMessage = await parseAuthErrorMessage(res);
    if (authMessage) throw new AuthSessionError(authMessage);

    const errorBody = await res.text().catch(() => '');
    console.error(`[fetchSubscriptionMe] status=${res.status} body=${errorBody}`);
    return null;
  }

  return res.json();
}

export async function cancelSubscription(accessToken: string): Promise<CancelSubscriptionResponse> {
  const res = await fetch(`${API_BASE_URL}/subscriptions/me/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) throw new AuthSessionError(authMessage);
  }

  const rawText = await res.text();

  if (!res.ok) {
    let message = '구독 해지에 실패했습니다.';
    try {
      const errorBody = JSON.parse(rawText);
      message = errorBody.message || message;
    } catch {
      // JSON이 아니면 기본 메시지 사용
    }
    throw new Error(message);
  }

  if (!rawText) {
    throw new Error('구독 해지 응답을 확인할 수 없습니다.');
  }

  return JSON.parse(rawText);
}
