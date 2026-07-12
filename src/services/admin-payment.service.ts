import {
  AdminCoursePaymentListResponse,
  AdminSubscriptionPaymentListResponse,
  AdminPaymentSearchParams,
} from '@/features/admin/paymentmanage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const EMPTY_LIST = { items: [], totalElements: 0, totalPages: 0, page: 0, size: 10 };

function buildQuery(params: AdminPaymentSearchParams): string {
  const query = new URLSearchParams();
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.keyword) query.set('keyword', params.keyword);
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 10));
  return query.toString();
}

// 강의 결제 내역 조회
export async function fetchAdminCoursePayments(
  accessToken: string,
  params: AdminPaymentSearchParams,
): Promise<AdminCoursePaymentListResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/payments/courses?${buildQuery(params)}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminCoursePayments] status=${res.status} body=${errorBody}`);
      return EMPTY_LIST;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminCoursePayments] fetch error:', e);
    return EMPTY_LIST;
  }
}

// 구독권 결제 내역 조회
export async function fetchAdminSubscriptionPayments(
  accessToken: string,
  params: AdminPaymentSearchParams,
): Promise<AdminSubscriptionPaymentListResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/payments/subscriptions?${buildQuery(params)}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminSubscriptionPayments] status=${res.status} body=${errorBody}`);
      return EMPTY_LIST;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminSubscriptionPayments] fetch error:', e);
    return EMPTY_LIST;
  }
}
