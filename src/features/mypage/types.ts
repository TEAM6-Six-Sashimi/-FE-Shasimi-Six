import { UserMe } from '@/features/auth/types';

export interface UserAgreements {
  privacy: boolean;
  marketing: boolean;
  emailNotice: boolean;
  aiUsage: boolean;
}

export interface UserMeWithAgreements extends UserMe {
  agreements: UserAgreements;
}

export function withAgreements(user: UserMe): UserMeWithAgreements {
  return {
    ...user,
    agreements: {
      privacy: true, // 필수 항목, 항상 true
      marketing: user.marketingConsent,
      emailNotice: user.emailConsent,
      aiUsage: user.aiConsent,
    },
  };
}

// 강의 결제 내역
export interface CoursePaymentItemCourse {
  courseId: number;
  title: string;
  thumbnail: string;
  price: number;
}

export interface CoursePaymentItem {
  paymentId: number;
  orderId: number;
  orderNo: string;
  amount: number;
  paymentStatus: string;
  orderStatus: string;
  paidAt: string;
  createdAt: string;
  courses: CoursePaymentItemCourse[];
}

export interface CoursePaymentHistoryResponse {
  items: CoursePaymentItem[];
}

// 구독 플랜 결제 내역
export interface SubscriptionPaymentItem {
  subscriptionPaymentId: number;
  subscriptionId: number;
  orderId: number;
  orderNo: string;
  paymentId: number;
  planCode: string;
  planName: string;
  billingType: 'NEW' | 'RENEWAL' | string;
  amount: number;
  paymentStatus: string;
  paidAt: string;
}

export interface SubscriptionPaymentHistoryResponse {
  items: SubscriptionPaymentItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// 현재 구독 상태 (GET /subscriptions/me)
export interface SubscriptionMeResponse {
  subscribed: boolean; // 현재 구독 중인지 여부
  subscriptionId: number;
  planCode: string;
  planName: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  nextBillingAt: string | null;
  autoRenew: boolean;
  cancellable: boolean; // true면 아직 해지 안 한 상태(해지하기 버튼 노출), false면 이미 해지 신청됨
}

// 구독 해지
export interface CancelSubscriptionResponse {
  subscriptionId: number;
  planCode: string;
  planName: string;
  status: string;
  cancelScheduled: boolean;
  expiresAt: string;
  nextBillingAt: string | null;
  aiAvailable: boolean;
  message: string;
}