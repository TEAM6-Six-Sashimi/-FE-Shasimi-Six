import {
  CreditBalanceResponse,
  CreditReadyRequest,
  CreditReadyResponse,
  CreditConfirmRequest,
  CreditConfirmResponse,
} from '@/features/user/credit/types';
import { CreditChargeHistoryResponse } from '@/features/mypage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 내 크레딧 잔액 조회
export async function fetchCreditBalance(accessToken: string): Promise<CreditBalanceResponse> {
  const res = await fetch(`${API_BASE_URL}/credits/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || '크레딧 잔액 조회에 실패했습니다.');
  }

  return res.json();
}

// 크레딧 충전 준비 (Toss 결제창 호출 전, 주문 정보 생성)
export async function readyCreditCharge(
  accessToken: string,
  body: CreditReadyRequest,
): Promise<CreditReadyResponse> {
  const res = await fetch(`${API_BASE_URL}/credits/toss/ready`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || '충전 준비에 실패했습니다.');
  }

  return res.json();
}

// 크레딧 충전 승인 (Toss 결제 성공 후 호출)
export async function confirmCreditCharge(
  accessToken: string,
  body: CreditConfirmRequest,
): Promise<CreditConfirmResponse> {
  const res = await fetch(`${API_BASE_URL}/credits/toss/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || '충전 승인에 실패했습니다.');
  }

  return res.json();
}

// 크레딧 충전 내역 조회
export async function fetchCreditChargeHistory(
  accessToken: string,
  page = 0,
  size = 10,
): Promise<CreditChargeHistoryResponse> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });

  const res = await fetch(`${API_BASE_URL}/credits/charges?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    console.error(`[fetchCreditChargeHistory] status=${res.status} body=${errorBody}`);
    return { items: [], totalElements: 0, totalPages: 0, page: 0, size };
  }

  return res.json();
}
