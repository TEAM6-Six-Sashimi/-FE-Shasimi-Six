// 결제 서비스

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
      'Authorization': `Bearer ${accessToken}`,
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
  courseId: number
): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/payments/course/${courseId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json().catch(() => ({} as ApiErrorResponse));
    throw new Error(errorBody?.errorCode ?? '결제에 실패했습니다.');
  }

  return response.json();
}

// 장바구니 선택 강의 결제
// POST /payments/cart/checkout
export async function paymentCartCheckout(
  accessToken: string,
  courseIds: number[]
): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/payments/cart/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ courseIds }),
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json().catch(() => ({} as ApiErrorResponse));
    throw new Error(errorBody?.errorCode ?? '결제에 실패했습니다.');
  }

  return response.json();
}