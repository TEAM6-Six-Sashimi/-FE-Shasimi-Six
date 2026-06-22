'use server';

import { cookies } from 'next/headers';
import { chargeCredit, fetchCreditBalance } from '@/services/credit.service';
import { CreditBalanceResponse, CreditChargeResponse } from '@/features/user/credit/types';

// 현재 보유 크레딧 조회
export async function getCreditBalanceAction(): Promise<CreditBalanceResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  return fetchCreditBalance(accessToken);
}

// 크레딧 충전
export async function chargeCreditAction(amount: number): Promise<CreditChargeResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  return chargeCredit(accessToken, { amount });
}
