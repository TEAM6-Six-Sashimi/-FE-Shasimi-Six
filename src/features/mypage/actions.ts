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

export async function changePasswordAction(payload: ChangePasswordPayload) {
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
  return res.json();
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