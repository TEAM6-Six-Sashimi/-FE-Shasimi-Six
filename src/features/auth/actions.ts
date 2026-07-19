'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginService, reissueService } from '@/services/auth.service';
import { fetchUserMe } from '@/services/user.service';
import { LoginRequest } from '@/features/auth/types';

export async function loginAction(
  payload: LoginRequest,
): Promise<{ success: true; name: string } | { success: false; message: string }> {
  try {
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
      httpOnly: true,
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

    return { success: true, name: result.name };
  } catch (error) {
    const message = error instanceof Error ? error.message : '로그인에 실패했습니다.';
    return { success: false, message };
  }
}

async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('role'); // role도 삭제
  cookieStore.delete('accessTokenExpiresAt');
}

export async function logoutAction(): Promise<void> {
  await clearAuthCookies();
  redirect('/');
}

// 토큰 만료 등으로 세션이 끊겨 재로그인이 필요한 경우 - 홈이 아니라 로그인 페이지로 바로 이동시킨다.
export async function logoutToLoginAction(): Promise<void> {
  await clearAuthCookies();
  redirect('/auth/login');
}

// 토큰 재발급(연장하기)
export async function reissueAction(): Promise<
  { success: true } | { success: false; message?: string }
> {
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
  } catch (error) {
    // 재발급 실패 시 로그인 페이지로 이동
    return { success: false, message: error instanceof Error ? error.message : undefined };
  }
}
