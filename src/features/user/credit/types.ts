export interface CreditBalanceResponse {
  balance: number;
}

// 크레딧 충전 준비 (POST /credits/toss/ready)
export interface CreditReadyRequest {
  amount: number;
}

export interface CreditReadyResponse {
  orderId: string;
  orderName: string;
  amount: number;
}

// 크레딧 충전 승인 (POST /credits/toss/confirm)
export interface CreditConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface CreditConfirmResponse {
  balance: number;
  orderId: string;
  paymentKey: string;
  chargedAmount: number;
}