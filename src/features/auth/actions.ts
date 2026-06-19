'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginService, reissueService } from '@/services/auth.service';
import { fetchUserMe } from '@/services/user.service';
import { LoginRequest } from '@/features/auth/types';

export async function loginAction(payload: LoginRequest): Promise<{ name: string }> {
  const result = await loginService(payload);

  const cookieStore = await cookies();

  const maxAgeSeconds = Math.floor((result.accessTokenExpiresIn - Date.now()) / 1000);

  cookieStore.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAgeSeconds,
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
    maxAge: maxAgeSeconds,
    path: '/',
  });

  // accessToken 만료시간 저장
  cookieStore.set('accessTokenExpiresAt', String(result.accessTokenExpiresIn), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: maxAgeSeconds,
    path: '/',
  });

  return { name: result.name };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('role'); // role도 삭제
  cookieStore.delete('accessTokenExpiresAt');
  redirect('/');
}

// 토큰 재발급(연장하기)
export async function reissueAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
 
  if (!refreshToken) {
    return { success: false };
  }
 
  try {
    const result = await reissueService(refreshToken);

    const maxAgeSeconds = Math.floor((result.accessTokenExpiresIn - Date.now()) / 1000);
 
    cookieStore.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeSeconds,
      path: '/',
    });
 
    cookieStore.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
 
    // 만료 시각도 새로 갱신
    cookieStore.set('accessTokenExpiresAt', String(result.accessTokenExpiresIn), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAgeSeconds,
      path: '/',
    });
 
    return { success: true };
  } catch {
    // 재발급 실패 시 로그인 페이지로 이동
    return { success: false };
  }
}