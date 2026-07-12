'use server';

import { cookies } from 'next/headers';
import { fetchAdminCreditCharges } from '@/services/admin-credit.service';
import { AdminCreditChargeListResponse, AdminCreditSearchParams } from './types';

export async function fetchCreditChargesAction(
  params: AdminCreditSearchParams,
): Promise<AdminCreditChargeListResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  return fetchAdminCreditCharges(accessToken, params);
}
