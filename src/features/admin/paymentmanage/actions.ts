'use server';

import { cookies } from 'next/headers';
import {
  fetchAdminCoursePayments,
  fetchAdminSubscriptionPayments,
} from '@/services/admin-payment.service';
import {
  AdminCoursePaymentListResponse,
  AdminSubscriptionPaymentListResponse,
  AdminPaymentSearchParams,
} from './types';

export async function fetchCoursePaymentsAction(
  params: AdminPaymentSearchParams,
): Promise<AdminCoursePaymentListResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  return fetchAdminCoursePayments(accessToken, params);
}

export async function fetchSubscriptionPaymentsAction(
  params: AdminPaymentSearchParams,
): Promise<AdminSubscriptionPaymentListResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  return fetchAdminSubscriptionPayments(accessToken, params);
}
