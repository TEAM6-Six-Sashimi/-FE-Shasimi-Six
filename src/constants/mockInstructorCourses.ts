// ── 대시보드 통계 ─────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  platformFee: number;
  withdrawable: number;
  totalSettled: number;
}

export interface CourseRevenue {
  id: number;
  title: string;
  revenue: number;
  studentCount: number;
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

// ── 목업 데이터 ───────────────────────────────────────────────────
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 38544300,
  platformFee: 11563290,
  withdrawable: 26981010,
  totalSettled: 0,
};


export const MOCK_COURSE_REVENUES: CourseRevenue[] = [
  { id: 1, title: 'React 완전 정복', revenue: 12500000, studentCount: 1250, completedCount: 875, totalCount: 1250, completionRate: 70 },
  { id: 2, title: 'TypeScript 마스터', revenue: 9800000, studentCount: 980, completedCount: 686, totalCount: 980, completionRate: 70 },
  { id: 3, title: 'Node.js 백엔드 실전', revenue: 7560000, studentCount: 756, completedCount: 378, totalCount: 756, completionRate: 50 },
  { id: 4, title: 'Python 데이터 분석', revenue: 21000000, studentCount: 2100, completedCount: 1470, totalCount: 2100, completionRate: 70 },
  { id: 5, title: 'AWS 클라우드 기초', revenue: 4500000, studentCount: 450, completedCount: 180, totalCount: 450, completionRate: 40 },
];