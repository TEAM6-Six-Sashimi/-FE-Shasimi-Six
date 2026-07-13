import { AdminDashboardSummary, AdminDashboardStatistics } from '@/features/admin/Dashboard/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 관리자 대시보드 요약 조회 (상단 카드 3개)
export async function fetchAdminDashboardSummary(
  accessToken: string,
): Promise<AdminDashboardSummary | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/summary`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminDashboardSummary] status=${res.status} body=${errorBody}`);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminDashboardSummary] fetch error:', e);
    return null;
  }
}

// 관리자 대시보드 현황 요약 조회 (전체 회원 수 등 4개 카드)
export async function fetchAdminDashboardStatistics(
  accessToken: string,
): Promise<AdminDashboardStatistics | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard/statistics`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminDashboardStatistics] status=${res.status} body=${errorBody}`);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminDashboardStatistics] fetch error:', e);
    return null;
  }
}
