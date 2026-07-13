'use server';

import { cookies } from 'next/headers';
import { fetchMyCoverLetter, saveCoverLetter } from '@/services/self-introduction.service';
import { CoverLetterResponse, CoverLetterSavePayload } from './types';

export async function fetchMyCoverLetterAction(): Promise<CoverLetterResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchMyCoverLetter(accessToken);
}

export async function saveCoverLetterAction(payload: CoverLetterSavePayload) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return { success: false as const };

  return saveCoverLetter(accessToken, payload);
}
