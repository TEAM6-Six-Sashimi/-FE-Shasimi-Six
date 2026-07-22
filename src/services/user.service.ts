import { UserMe } from '@/features/auth/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const GUEST_USER: UserMe = {
  id: 0,
  name: '',
  loginId: '',
  email: '',
  phone: '',
  createdAt: '',
  birthDate: '',
  role: 'GUEST',
  status: '',
  emailVerified: false,
  referralCode: '',
  interestCategoryIds: [],
  marketingConsent: false,
  emailConsent: false,
  aiConsent: false,
};

export async function fetchUserMe(accessToken: string): Promise<UserMe> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn('fetchUserMe failed', { status: response.status });
      return GUEST_USER;
    }

    return response.json();
  } catch (e) {
    console.log('fetchUserMe error:', e);
    return GUEST_USER;
  }
}

// 실패 시 GUEST_USER로 넘기지 않고 응답을 그대로 노출하여
// 호출부가 "원래 비로그인"과 "세션이 죽음"을 구분
export class UserMeAuthError extends Error {
  constructor(public response: Response) {
    super('사용자 정보를 가져오지 못했습니다.');
  }
}

export async function fetchUserMeStrict(accessToken: string): Promise<UserMe> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new UserMeAuthError(response);
  }

  return response.json();
}
