'use server'

import { cookies } from 'next/headers';
import { loginService } from '@/services/auth.service';
import { LoginRequest } from '@/features/auth/types';

export async function loginAction(payload: LoginRequest): Promise<{ name: string }> {
  const result = await loginService(payload);

  const cookieStore = await cookies();

  // accessToken: 3시간 (accessTokenExpiresIn 초 단위)
  cookieStore.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: result.accessTokenExpiresIn, // 초 단위
    path: '/',
  });

  // refreshToken: 7일 (백엔드 만료 정책에 맞게 조정)
  cookieStore.set('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { name: result.name };
}