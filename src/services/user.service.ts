import { UserMe } from '@/features/auth/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchUserMe(accessToken: string): Promise<UserMe | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    console.log('fetchUserMe status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log('fetchUserMe error body:', errorBody);
      return null;
    }

    return response.json();
  } catch (e) {
    console.log('fetchUserMe error:', e);
    return null;
  }
}