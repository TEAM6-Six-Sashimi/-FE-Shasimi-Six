import { UserMe } from '@/features/auth/types';

// 동의 여부 - 백엔드 DB 작업 전 자리 마련
export interface UserAgreements {
  privacy: boolean; 
  marketing: boolean;
  emailNotice: boolean; 
  aiUsage: boolean;
}

export interface UserMeWithAgreements extends UserMe {
  agreements?: UserAgreements; // 추후 백엔드 연동 시 채워질 필드
}