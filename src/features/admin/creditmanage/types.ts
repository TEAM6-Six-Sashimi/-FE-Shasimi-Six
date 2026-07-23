export interface AdminCreditCharge {
  rowNumber: number;
  orderNo: string;
  loginId: string;
  chargedCredit: number;
  paymentMethod: string;
  paidAmount: number;
  approvedAt: string;
}

export interface AdminCreditChargeListResponse {
  items: AdminCreditCharge[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  authError?: true;
  // 조회 자체가 실패했을 때만 true("실제로 0건"인 경우와 구분하기 위한 필드)
  error?: true;
}

export interface AdminCreditSearchParams {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  size?: number;
}
