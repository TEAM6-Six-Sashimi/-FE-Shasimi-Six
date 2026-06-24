'use server';

import { cookies } from 'next/headers';
import { UserMeWithAgreements } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface ChangePasswordResponse {
  passwordChanged: boolean;
  requiresLogin: boolean;
  accessToken: string;
  refreshToken: string;
}

export async function changePasswordAction(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
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

  // 비밀번호 변경으로 기존 토큰이 무효화되므로, 서버가 내려준 새 토큰으로 쿠키를 즉시 교체
  if (data.accessToken) {
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
  if (data.refreshToken) {
    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return data;
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