'use server';

import { cookies } from 'next/headers';
import { fetchNotices, createNotice } from '@/services/notice.service';
import {
  AdminNoticeListResponse,
  AdminNoticeSearchParams,
  CreateNoticePayload,
  CreateNoticeResult,
} from './types';

export async function fetchNoticesAction(
  params: AdminNoticeSearchParams,
): Promise<AdminNoticeListResponse> {
  return fetchNotices(params);
}

export async function createNoticeAction(
  payload: CreateNoticePayload,
): Promise<CreateNoticeResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  return createNotice(accessToken, payload);
}
