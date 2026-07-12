import {
  AdminCreditChargeListResponse,
  AdminCreditSearchParams,
} from '@/features/admin/creditmanage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_LIST = { items: [], totalElements: 0, totalPages: 0, page: 0, size: 10 };

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
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminCreditCharges] status=${res.status} body=${errorBody}`);
      return EMPTY_LIST;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminCreditCharges] fetch error:', e);
    return EMPTY_LIST;
  }
}
