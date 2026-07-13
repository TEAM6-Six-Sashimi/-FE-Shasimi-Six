'use server';

import { fetchNotices } from '@/services/notice.service';
import { AdminNoticeListResponse, AdminNoticeSearchParams } from './types';

export async function fetchNoticesAction(
  params: AdminNoticeSearchParams,
): Promise<AdminNoticeListResponse> {
  return fetchNotices(params);
}
