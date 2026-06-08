'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginService } from '@/services/auth.service';
import { fetchUserMe } from '@/services/user.service';
import { LoginRequest } from '@/features/auth/types';

export async function loginAction(payload: LoginRequest): Promise<{ name: string }> {
  const result = await loginService(payload);

  const cookieStore = await cookies();

  cookieStore.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: result.accessTokenExpiresIn,
    path: '/',
  });

  cookieStore.set('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  // role 가져오기
  const user = await fetchUserMe(result.accessToken);
  cookieStore.set('role', user.role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: result.accessTokenExpiresIn,
    path: '/',
  });

  return { name: result.name };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('role'); // role도 삭제
  redirect('/');
}
