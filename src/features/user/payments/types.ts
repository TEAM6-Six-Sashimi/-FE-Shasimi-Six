export type PurchaseType = 'COURSE' | 'CART' | 'AI_SUBSCRIPTION';

// 결제 페이지- "주문 항목"
export interface OrderLineItem {
  id: string; // courseId 또는 planCode
  title: string;
  subtitle: string;
  meta?: string;
  price: number;
  thumbnail?: string;
}

export interface PaymentSummary {
  purchaseType: PurchaseType;
  items: OrderLineItem[];
  totalPrice: number;
  ownedCredits: number;
  remainingCredits: number;
  shortfallCredits: number;
  // COURSE/CART 결제
  courseIds?: number[];
  // AI_SUBSCRIPTION 결제
  planCode?: string;
}

export interface PaymentFormState {
  agreedToTerms: boolean;
  agreedToRefundPolicy: boolean;
}

// ── 체크아웃 (공용) ──────────────────────────────────────────

export interface CheckoutRequest {
  purchaseType: PurchaseType;
  courseId?: number;
  courseIds?: number[];
  planCode?: string;
  agreed: boolean;
}

export interface CheckoutCourseResult {
  courseId: number;
  title: string;
  price: number;
}

export interface CheckoutResponse {
  orderId: number;
  orderNo: string;
  paymentId: number;
  purchaseType: PurchaseType;
  amount: number;
  status: string;
  creditBalance: number;
  courses: CheckoutCourseResult[] | null;
  subscription: {
    planCode: string;
    planName: string;
    expiresAt: string;
  } | null;
}

// ── AI 구독 플랜 ───────────────────────────────────────────

export interface SubscriptionPlan {
  planCode: string;
  planThumbnail: string;
  planName: string;
  durationMonths: number;
  originalPrice: number;
  price: number;
  discountRate: number;
  features: string[];
}

export interface PlanPreview extends SubscriptionPlan {
  creditBalance: number;
  balanceAfterPayment: number;
  insufficientAmount: number;
  alreadySubscribed: boolean;
  purchasable: boolean;
}

export interface MySubscription {
  subscribed: boolean;
  subscriptionId: number;
  planCode: string;
  planName: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  nextBillingAt: string | null;
  autoRenew: boolean;
  cancellable: boolean;
}

export interface SubscriptionPayment {
  subscriptionPaymentId: number;
  subscriptionId: number;
  orderId: number;
  orderNo: string;
  planCode: string;
  planName: string;
  amount: number;
  billingType: string;
  paidAt: string;
}

export interface SubscriptionPaymentsResponse {
  items: SubscriptionPayment[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// payment.service.ts
// 백엔드 공통 에러 응답
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  errorCode: string;
  message: string;
  path: string;
  traceId: string;
}

// 결제 성공 응답 (단일/장바구니 동일 구조)
export interface PaymentResponse {
  orderId: number;
  orderNo: string;
  paymentId: number;
  amount: number;
  status: string;
  courses: {
    courseId: number;
    title: string;
    price: number;
  }[];
}