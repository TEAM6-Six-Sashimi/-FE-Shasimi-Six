// 장바구니 서비스(cart/payment)
import { CartResponse } from '@/features/user/cart/types';
import { parseMaintenanceMessage, MaintenanceError } from '@/services/maintenance.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 백엔드 에러 응답
interface ApiErrorResponse {
  timestamp: string;
  status: number;
  errorCode: string;
  message: string;
  path: string;
  traceId: string;
}

// 장바구니 조회
export async function fetchCart(accessToken: string): Promise<CartResponse> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    console.log('fetchCart status:', response.status);
    throw new Error('장바구니 조회에 실패했습니다.');
  }

  return response.json();
}

// 장바구니 추가
//   CART_002        -> 이미 장바구니에 담긴 강의
//   ENROLLMENT_001 -> 이미 수강 중인 강의
//   UNAUTHORIZED    -> 로그인 필요
export async function addCartItem(
  accessToken: string,
  courseId: number,
): Promise<{ courseId: number; cartItemId: number }> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ courseId }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('UNAUTHORIZED');

    const maintenanceMessage = await parseMaintenanceMessage(response);
    if (maintenanceMessage) throw new MaintenanceError(maintenanceMessage);

    const errorBody: ApiErrorResponse = await response.json().catch(() => ({}) as ApiErrorResponse);
    const errorCode = errorBody?.errorCode ?? '';

    if (errorCode === 'CART_002' || errorCode === 'ENROLLMENT_001') {
      throw new Error(errorCode);
    }

    throw new Error(errorBody?.message ?? '장바구니 추가에 실패했습니다.');
  }

  return response.json();
}

// 장바구니 아이템 삭제
export async function deleteCartItems(accessToken: string, cartItemIds: number[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ cartItemIds }),
  });

  if (!response.ok) {
    throw new Error('장바구니 삭제에 실패했습니다.');
  }
}
