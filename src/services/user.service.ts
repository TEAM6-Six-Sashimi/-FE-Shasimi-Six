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
      console.log('fetchUserMe error body:', errorBody);
      return GUEST_USER;
    }

    return response.json();
  } catch (e) {
    console.log('fetchUserMe error:', e);
    return GUEST_USER;
  }
}