'use server';

import { cookies } from 'next/headers';
import {
  fetchCreditBalance,
  readyCreditCharge,
  confirmCreditCharge,
} from '@/services/credit.service';
import {
  CreditBalanceResponse,
  CreditReadyResponse,
  CreditConfirmResponse,
} from '@/features/user/credit/types';

// 현재 보유 크레딧 조회
export async function getCreditBalanceAction(): Promise<CreditBalanceResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  return fetchCreditBalance(accessToken);
}

// 크레딧 충전 준비 — Toss 결제창 호출 직전, 주문 정보 생성
export async function readyCreditChargeAction(amount: number): Promise<CreditReadyResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  return readyCreditCharge(accessToken, { amount });
}

// 크레딧 충전 승인 — Toss 결제 성공 후, success 페이지에서 호출
export async function confirmCreditChargeAction(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<CreditConfirmResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  return confirmCreditCharge(accessToken, params);
}