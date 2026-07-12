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
}

export interface AdminCreditSearchParams {
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  size?: number;
}
