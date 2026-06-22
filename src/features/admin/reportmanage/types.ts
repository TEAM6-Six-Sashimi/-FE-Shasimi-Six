export type ReportStatus = 'PENDING' | 'PROCESSED';

export type ReportCategory = 'PROFANITY' | 'SPAM' | 'FALSE_INFO' | 'OTHER';

export const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  PROFANITY: '욕설 및 비방',
  SPAM: '스팸 및 광고',
  FALSE_INFO: '허위 정보',
  OTHER: '기타',
};

export const REPORT_CATEGORY_STYLE: Record<ReportCategory, string> = {
  PROFANITY: 'bg-[#FEF3C7] text-[#92400E]',
  SPAM: 'bg-[#FEF3C7] text-[#92400E]',
  FALSE_INFO: 'bg-[#FEF3C7] text-[#92400E]',
  OTHER: 'bg-[#F3F4F6] text-[#6A7282]',
};

// 목록 조회 (GET /admin/reviews/reports) 응답 항목
export interface ReviewReport {
  reportId: number;
  reviewContent: string;
  courseName: string;
  writerLoginId: string;
  category: ReportCategory;
  reportedAt: string;
  status: ReportStatus;
}

// 상세 조회 (GET /admin/reviews/reports/{reportId}) 응답
export interface ReviewReportDetail {
  reviewContent: string;
  writerLoginId: string;
  reporterLoginId: string;
  reportedAt: string;
  category: ReportCategory;
  reason: string;
}