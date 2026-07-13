'use server';

import { cookies } from 'next/headers';
import { fetchNotices, createNotice, fetchNoticeDetail, deleteNotice } from '@/services/notice.service';
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
  return createNotice(accessToken, payload);
}

export async function fetchNoticeDetailAction(noticeId: number): Promise<NoticeDetailResult> {
  return fetchNoticeDetail(noticeId);
}

export async function deleteNoticeAction(noticeId: number): Promise<DeleteNoticeResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  return deleteNotice(accessToken, noticeId);
}
