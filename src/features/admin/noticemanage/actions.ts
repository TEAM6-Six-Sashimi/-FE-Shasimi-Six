'use server';

import { cookies } from 'next/headers';
import { updateTag } from 'next/cache';
import {
  fetchNotices,
  createNotice,
  fetchNoticeDetail,
  deleteNotice,
  NOTICE_CACHE_TAG,
} from '@/services/notice.service';
import {
  AdminNoticeListResponse,
  AdminNoticeSearchParams,
  CreateNoticePayload,
  CreateNoticeResult,
  NoticeDetailResult,
  DeleteNoticeResult,
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
  const result = await createNotice(accessToken, payload);
  if (result.success) updateTag(NOTICE_CACHE_TAG);
  return result;
}

export async function fetchNoticeDetailAction(noticeId: number): Promise<NoticeDetailResult> {
  return fetchNoticeDetail(noticeId);
}

export async function deleteNoticeAction(noticeId: number): Promise<DeleteNoticeResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  const result = await deleteNotice(accessToken, noticeId);
  if (result.success) updateTag(NOTICE_CACHE_TAG);
  return result;
}
