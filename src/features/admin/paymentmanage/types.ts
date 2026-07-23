// 강의 결제 내역
export interface AdminCoursePaymentItem {
  courseTitle: string;
  price: number;
}

export interface AdminCoursePayment {
  rowNumber: number;
  orderNo: string;
  userName: string;
  loginId: string;
  courses: AdminCoursePaymentItem[];
  totalAmount: number;
  paidAt: string;
}

export interface AdminCoursePaymentListResponse {
  items: AdminCoursePayment[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  authError?: true;
  // 조회 자체가 실패했을 때만 true("실제로 0건"인 경우와 구분)
  error?: true;
}

// 구독권 결제 내역
export type SubscriptionPlanCode = 'MONTHLY' | 'ANNUAL';

export interface AdminSubscriptionPayment {
  rowNumber: number;
  orderNo: string;
  userName: string;
  loginId: string;
  planCode: SubscriptionPlanCode;
  planName: string;
  amount: number;
  paidAt: string;
}

export interface AdminSubscriptionPaymentListResponse {
  items: AdminSubscriptionPayment[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  authError?: true;
  // 조회 자체가 실패했을 때만 true("실제로 0건"인 경우와 구분)
  error?: true;
}

export interface AdminPaymentSearchParams {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  size?: number;
}
