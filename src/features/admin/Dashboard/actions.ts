'use server';

import { cookies } from 'next/headers';
import { fetchAdminLoginStats, fetchAdminAiUsageStats } from '@/services/admin-dashboard.service';
import { LoginStatsPeriod, AdminLoginStatsResult, AdminAiUsageStatsResult } from './types';

export async function fetchAdminLoginStatsAction(
  period: LoginStatsPeriod,
): Promise<AdminLoginStatsResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  return fetchAdminLoginStats(accessToken, period);
}

export async function fetchAdminAiUsageStatsAction(
  period: LoginStatsPeriod,
): Promise<AdminAiUsageStatsResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  return fetchAdminAiUsageStats(accessToken, period);
}
