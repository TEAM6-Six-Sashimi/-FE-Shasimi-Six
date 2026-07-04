export type ReportStatus = 'PENDING' | 'PROCESSED';
export type ReviewStatus = 'ACTIVE' | 'DELETED';
export type ReportCategory = 'ABUSE' | 'SPAM' | 'FALSE_INFO' | 'OTHER';

export const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  ABUSE: '욕설 및 비방',
  SPAM: '스팸 및 광고',
  FALSE_INFO: '허위 정보',
  OTHER: '기타',
};

export const REPORT_CATEGORY_STYLE: Record<ReportCategory, string> = {
  ABUSE: 'bg-[#FEF3C7] text-[#92400E]',
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
  reviewStatus: ReviewStatus; 
  reportStatus: ReportStatus; 
}

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: '처리 대기',
  PROCESSED: '처리 완료',
};

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  ACTIVE: '리뷰 유지됨 (반려)',
  DELETED: '리뷰 삭제됨',
};

export const REVIEW_STATUS_STYLE: Record<ReviewStatus, string> = {
  ACTIVE: 'bg-[#F1FFC1] text-[#5C7A00]',
  DELETED: 'bg-[#FFEBEB] text-[#FF5E5E]',
};