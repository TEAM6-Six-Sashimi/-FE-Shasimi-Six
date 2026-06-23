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