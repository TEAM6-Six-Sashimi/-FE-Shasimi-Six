import {
  AdminCreditChargeListResponse,
  AdminCreditSearchParams,
} from '@/features/admin/creditmanage/types';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_LIST = { items: [], totalElements: 0, totalPages: 0, page: 0, size: 10 };
const AUTH_ERROR_LIST = { ...EMPTY_LIST, authError: true as const };
const ERROR_LIST = { ...EMPTY_LIST, error: true as const };

function buildQuery(params: AdminCreditSearchParams): string {
  const query = new URLSearchParams();
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.keyword) query.set('keyword', params.keyword);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return query.toString();
}

// 크레딧 충전 내역 조회
export async function fetchAdminCreditCharges(
  accessToken: string,
  params: AdminCreditSearchParams,
): Promise<AdminCreditChargeListResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/credits/charges?${buildQuery(params)}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) return AUTH_ERROR_LIST;

      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminCreditCharges] status=${res.status} body=${errorBody}`);
      return ERROR_LIST;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminCreditCharges] fetch error:', e);
    return ERROR_LIST;
  }
}
