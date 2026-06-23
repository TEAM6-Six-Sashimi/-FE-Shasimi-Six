import { UserMe } from '@/features/auth/types';

export interface UserAgreements {
  privacy: boolean;
  marketing: boolean;
  emailNotice: boolean;
  aiUsage: boolean;
}

export interface UserMeWithAgreements extends UserMe {
  agreements?: UserAgreements;
}

// API 응답(marketingConsent, emailConsent, aiConsent)을 화면에서 쓰는 agreements 형태로 변환
// UserMe 응답에 실제로 marketingConsent/emailConsent/aiConsent 필드가 추가되면 아래에서 매핑
export function withAgreements(
  user: UserMe & {
    marketingConsent?: boolean;
    emailConsent?: boolean;
    aiConsent?: boolean;
  },
): UserMeWithAgreements {
  return {
    ...user,
    agreements: {
      privacy: true, // 필수 항목, 항상 true
      marketing: user.marketingConsent ?? false,
      emailNotice: user.emailConsent ?? false,
      aiUsage: user.aiConsent ?? false,
    },
  };
}