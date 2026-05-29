// ── 대시보드 통계 ─────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  platformFee: number;
  withdrawable: number;
  totalSettled: number;
}

// ── 목업 데이터 ───────────────────────────────────────────────────
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 38544300,
  platformFee: 11563290,
  withdrawable: 26981010,
  totalSettled: 0,
};
