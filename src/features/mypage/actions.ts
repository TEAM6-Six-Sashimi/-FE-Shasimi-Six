'use server';

import { cookies } from 'next/headers';
import { UserMeWithAgreements } from './types';
import { cancelSubscription } from '@/services/payment.service';
import { AuthSessionError } from '@/features/auth/errors';
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

export type UpdateMeResult =
  | { success: true; data: UserMeWithAgreements }
  | { success: false; message: string };

export async function updateMeAction(payload: UpdateMePayload): Promise<UpdateMeResult> {
  try {
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
    return { success: true, data: await res.json() };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '개인정보 수정에 실패했습니다.',
    };
  }
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

export type ChangePasswordResult =
  | { success: true; requiresLogin: boolean }
  | { success: false; message: string };

export async function changePasswordAction(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResult> {
  try {
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

    if (data.requiresLogin) {
      return { success: true, requiresLogin: true };
    }

    // requiresLogin이 false인데 토큰 중 하나라도 빠져 있으면 응답이 불완전한 상태이므로 성공으로 처리하지 않고 명시적으로 실패
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

    return { success: true, requiresLogin: false };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.',
    };
  }
}

export type DeleteMeActionResult = { success: true } | { success: false; message: string };

export async function deleteMeAction(currentPassword: string): Promise<DeleteMeActionResult> {
  try {
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

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));

      if (errorBody.errorCode === 'USER_003') {
        throw new Error('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
      }

      throw new Error(errorBody.message || '회원 탈퇴에 실패했습니다.');
    }

    // 탈퇴 성공
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('role');
    cookieStore.delete('accessTokenExpiresAt');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '회원 탈퇴에 실패했습니다.',
    };
  }
}

// 결제 내역
export type CancelSubscriptionActionResult =
  | { success: true; data: CancelSubscriptionResponse }
  | { success: false; authError?: true; message: string };

export async function cancelSubscriptionAction(): Promise<CancelSubscriptionActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const data = await cancelSubscription(accessToken);
    return { success: true, data };
  } catch (error) {
    if (error instanceof AuthSessionError) {
      return { success: false, authError: true, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : '구독 해지에 실패했습니다.',
    };
  }
}
