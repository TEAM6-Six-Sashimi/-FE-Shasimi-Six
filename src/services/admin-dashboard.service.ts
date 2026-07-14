import {
  AdminDashboardSummary,
  AdminDashboardStatistics,
  LoginStatsPeriod,
  AdminLoginStatsResult,
  AdminAiUsageStatsResult,
} from '@/features/admin/Dashboard/types';

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

// 관리자 로그인 수 통계 조회 (시간대별/요일별 로그인 차트)
export async function fetchAdminLoginStats(
  accessToken: string,
  period: LoginStatsPeriod,
): Promise<AdminLoginStatsResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats/logins?period=${period}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminLoginStats] status=${res.status} body=${errorBody}`);
      if (res.status === 503) {
        return {
          success: false,
          message: '통계 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        };
      }
      return { success: false, message: '로그인 통계를 불러오지 못했습니다.' };
    }

    const body = await res.json();
    return { success: true, data: body.data ?? [] };
  } catch (e) {
    console.error('[fetchAdminLoginStats] fetch error:', e);
    return { success: false, message: '로그인 통계를 불러오는 중 오류가 발생했습니다.' };
  }
}

// 관리자 AI 기능 사용량 통계 조회 (시간대별/요일별)
export async function fetchAdminAiUsageStats(
  accessToken: string,
  period: LoginStatsPeriod,
): Promise<AdminAiUsageStatsResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats/ai-usage?period=${period}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminAiUsageStats] status=${res.status} body=${errorBody}`);
      if (res.status === 503) {
        return {
          success: false,
          message: '통계 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        };
      }
      return { success: false, message: 'AI 기능 사용량을 불러오지 못했습니다.' };
    }

    const body = await res.json();
    return { success: true, data: body.data ?? [] };
  } catch (e) {
    console.error('[fetchAdminAiUsageStats] fetch error:', e);
    return { success: false, message: 'AI 기능 사용량을 불러오는 중 오류가 발생했습니다.' };
  }
}
