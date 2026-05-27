// 회원 정보 도메인 타입 (백엔드 회원 API)

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED' | 'SUSPENDED';

export interface UserResponseDto {
  id: number;
  name: string;
  loginId: string;
  email: string;
  birthDate: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  referralCode?: string;
  interestCategoryIds?: number[];
}

export interface UpdateMyInfoRequest {
  currentPassword: string;
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  newPasswordMatched?: boolean;
}

export interface ChangePasswordResponse {
  passwordChanged: boolean;
  requiresLogin: boolean;
}

export interface WithdrawUserRequest {
  currentPassword: string;
}

export interface WithdrawUserResponse {
  status: UserStatus;
}
