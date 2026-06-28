import {
  CoursePaymentHistoryResponse,
  SubscriptionPaymentHistoryResponse,
  CancelSubscriptionResponse,
  SubscriptionMeResponse,
} from '@/features//mypage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 백엔드 공통 에러 응답
interface ApiErrorResponse {
  timestamp: string;
  status: number;
  errorCode: string;
  message: string;
  path: string;
  traceId: string;
}

// 결제 성공 응답 (단일/장바구니 동일 구조)
export interface PaymentResponse {
  orderId: number;
  orderNo: string;
  paymentId: number;
  amount: number;
  status: string;
  courses: {
    courseId: number;
    title: string;
    price: number;
  }[];
}

// 보유 크레딧 조회
export async function fetchCredits(accessToken: string): Promise<{ balance: number }> {
  const response = await fetch(`${API_BASE_URL}/credits/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('크레딧 조회에 실패했습니다.');
  }

  return response.json();
}

// 단일 강의 바로 결제
// POST /payments/course/{courseId}
export async function paymentSingleCourse(
  accessToken: string,
  courseId: number,
): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/payments/course/${courseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json().catch(() => ({}) as ApiErrorResponse);
    throw new Error(errorBody?.errorCode ?? '결제에 실패했습니다.');
  }

  return response.json();
}

// 장바구니 선택 강의 결제
// POST /payments/cart/checkout
export async function paymentCartCheckout(
  accessToken: string,
  courseIds: number[],
): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/payments/cart/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ courseIds }),
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json().catch(() => ({}) as ApiErrorResponse);
    throw new Error(errorBody?.errorCode ?? '결제에 실패했습니다.');
  }

  return response.json();
}

// 결제 내역
export async function fetchCoursePaymentHistory(
  accessToken: string,
): Promise<CoursePaymentHistoryResponse> {
  const res = await fetch(`${API_BASE_URL}/payments/history`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
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
    const errorBody = await res.text().catch(() => '');
    console.error(`[fetchSubscriptionMe] status=${res.status} body=${errorBody}`);
    return null;
  }

  return res.json();
}

export async function cancelSubscription(
  accessToken: string,
): Promise<CancelSubscriptionResponse> {
  const res = await fetch(`${API_BASE_URL}/subscriptions/me/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

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