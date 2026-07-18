export interface AdminDashboardSummary {
  totalRevenue: number;
  netProfit: number;
  totalSettlementAmount: number;
  platformFeeRate: number;
}

export interface AdminDashboardStatistics {
  totalMembers: number;
  studentCount: number;
  instructorCount: number;
  totalCourses: number;
}

export type LoginStatsPeriod = 'hourly' | 'daily';

export interface AdminLoginStatPoint {
  label: string;
  count: number;
}

export type AdminLoginStatsResult =
  | { success: true; data: AdminLoginStatPoint[] }
  | { success: false; message: string; authError?: true };

export interface AdminAiUsageStatPoint {
  label: string;
  job_analysis: number;
  resume_evaluate: number;
  cover_letter_review: number;
}

export type AdminAiUsageStatsResult =
  | { success: true; data: AdminAiUsageStatPoint[] }
  | { success: false; message: string; authError?: true };
