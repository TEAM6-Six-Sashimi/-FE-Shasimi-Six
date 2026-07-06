'use server';

import { cookies } from 'next/headers';
import { readyCreditCharge, confirmCreditCharge } from '@/services/credit.service';
import { CreditReadyResponse, CreditConfirmResponse } from '@/features/user/credit/types';

// 크레딧 충전 준비 — Toss 결제창 호출 직전, 주문 정보 생성
export async function readyCreditChargeAction(
  amount: number,
): Promise<{ success: true; data: CreditReadyResponse } | { success: false; message: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const data = await readyCreditCharge(accessToken, { amount });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '충전 준비에 실패했습니다.',
    };
  }
}

// 크레딧 충전 승인 — Toss 결제 성공 후, success 페이지에서 호출
export async function confirmCreditChargeAction(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<
  { success: true; data: CreditConfirmResponse } | { success: false; message: string }
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const data = await confirmCreditCharge(accessToken, params);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '충전 승인에 실패했습니다.',
    };
  }
}