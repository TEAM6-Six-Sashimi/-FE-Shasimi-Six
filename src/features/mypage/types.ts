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


// 크레딧 충전 내역
export interface CreditChargeItem {
  creditChargePaymentId: number;
  orderId: string;
  paidAmount: number;
  chargedCredit: number;
  approvedAt: string;
  paymentMethod: string;
}

export interface CreditChargeHistoryResponse {
  items: CreditChargeItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// 강사 지원 내역
export type InstructorApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MyInstructorApplication {
  applicationId: number;
  categoryId: number;
  createdAt: string;
  approvalStatus: InstructorApplicationStatus;
}

export const INSTRUCTOR_APPLICATION_STATUS_LABEL: Record<InstructorApplicationStatus, string> = {
  PENDING: '심사 중',
  APPROVED: '승인',
  REJECTED: '반려',
};

export const INSTRUCTOR_APPLICATION_STATUS_STYLE: Record<InstructorApplicationStatus, string> = {
  PENDING: 'bg-[#FEF3C7] text-[#92400E]',
  APPROVED: 'bg-[#F1FFC1] text-[#5C7A00]',
  REJECTED: 'bg-[#FFEBEB] text-[#FF5E5E]',
};

// 강사 지원 상세 (반려 사유 포함)
// 관리자 반려 처리 시 실제로 전송/저장되는 값과 동일하게 맞춤 (admin 쪽 RejectionCategory 타입은 오타가 있어 미신뢰)
export type InstructorApplicationRejectionCategory =
  | 'INSUFFICIENT_CAREER_PROOF'
  | 'INSUFFICIENT_BASIC_INFO'
  | 'UNABLE_TO_VERIFY_IDENTITY'
  | 'INAPPROPRIATE_CAREER_INCLUDED';

export interface InstructorApplicationCertification {
  certificationName: string;
  issuedBy: string;
  fileUrl: string;
}

// GET /api/members/{userId}/instructor-applications/{applicationId}
export interface MyInstructorApplicationDetail {
  userName: string;
  loginId: string;
  email: string;
  phone: string;
  categoryId: number;
  createdAt: string;
  approvalStatus: InstructorApplicationStatus;
  rejectionCategory: InstructorApplicationRejectionCategory | null;
  rejectionReason: string | null;
  rejectedAt: string | null;
  profileImageUrl: string | null;
  bio: string;
  motivationLetter: string;
  portfolioUrl: string;
  resumeFileUrl: string;
  mainCareers: string[] | null;
  certifications: InstructorApplicationCertification[] | null;
}

export const INSTRUCTOR_REJECTION_CATEGORY_LABEL: Record<
  InstructorApplicationRejectionCategory,
  string
> = {
  INSUFFICIENT_CAREER_PROOF: '경력/이력 증빙 부족',
  INSUFFICIENT_BASIC_INFO: '기본 정보 미흡',
  UNABLE_TO_VERIFY_IDENTITY: '신원 확인 불가',
  INAPPROPRIATE_CAREER_INCLUDED: '부적절한 이력 포함',
};
