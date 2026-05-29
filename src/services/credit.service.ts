// 결제 서비스(크래딧 충전/차감 등)
import { CreditBalanceResponse, CreditChargeRequest, CreditChargeResponse } from '@/features/user/credit/types';
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
 
// 현재 보유 크레딧 조회
export async function fetchCreditBalance(accessToken: string): Promise<CreditBalanceResponse> {
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
 
// 크레딧 충전
export async function chargeCredit(
  accessToken: string,
  payload: CreditChargeRequest
): Promise<CreditChargeResponse> {
  const response = await fetch(`${API_BASE_URL}/credits/charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
 
  if (!response.ok) {
    throw new Error('크레딧 충전에 실패했습니다.');
  }
 
  return response.json();
}