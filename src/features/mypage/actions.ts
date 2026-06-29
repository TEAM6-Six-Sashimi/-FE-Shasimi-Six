'use server';

import { cookies } from 'next/headers';
import { UserMeWithAgreements } from './types';
import { cancelSubscription } from '@/services/payment.service';
import { CancelSubscriptionResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 개인정보 조회
interface UpdateMePayload {
  currentPassword: string;
  phone: string;
  marketingConsent: boolean;
  emailConsent: boolean;
  aiConsent: boolean;
}

export async function updateMeAction(payload: UpdateMePayload): Promise<UserMeWithAgreements> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('개인정보 수정에 실패했습니다.');
  return res.json();
}

// 개인정보 수정
interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface ChangePasswordResponse {
  passwordChanged: boolean;
  requiresLogin: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export async function changePasswordAction(
  payload: ChangePasswordPayload,
): Promise<{ passwordChanged: boolean }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/users/me/password`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      newPasswordMatched: payload.newPassword === payload.newPasswordConfirm,
    }),
  });

  if (!res.ok) throw new Error('비밀번호 변경에 실패했습니다.');

  const data: ChangePasswordResponse = await res.json();

  if (!data.passwordChanged) {
    throw new Error('비밀번호 변경에 실패했습니다.');
  }

  // requiresLogin이 true면 토큰을 재발급하지 않은 정상적인 "재로그인 필요" 흐름.
  // 성공으로 처리하지 않고 에러로 던져, 호출부가 재로그인 페이지로 보내게 한다.
  if (data.requiresLogin) {
    throw new Error('REQUIRES_LOGIN');
  }

  // requiresLogin이 false인데 토큰 중 하나라도 빠져 있으면 응답이 불완전한 상태이므로
  // 성공으로 처리하지 않고 명시적으로 실패시킨다. (한쪽 토큰만 갈아끼우는 상황 방지)
  if (!data.accessToken || !data.refreshToken) {
    throw new Error('비밀번호는 변경되었지만 세션 갱신에 실패했습니다. 다시 로그인해주세요.');
  }

  // 두 토큰이 모두 확인된 경우에만 쿠키 교체
  cookieStore.set('accessToken', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  cookieStore.set('refreshToken', data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { passwordChanged: true };
}

export async function deleteMeAction(currentPassword: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword }),
  });

  if (!res.ok) throw new Error('회원 탈퇴에 실패했습니다.');
}


// 결제 내역
export async function cancelSubscriptionAction(): Promise<CancelSubscriptionResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }
 
  const result = await cancelSubscription(accessToken);
 
  // 디버그: 백엔드 응답에 실제로 message가 들어있는지 확인 (확인 후 삭제 가능)
  console.log('[cancelSubscriptionAction] result =', JSON.stringify(result));
 
  return result;
}