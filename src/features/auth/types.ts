export type EmailVerifyPurpose = 'SIGNUP' | 'PASSWORD_RESET' | 'EMAIL_CHANGE';

// POST /verifications/email/request 응답
export interface EmailVerificationRequestResponseDto {
  targetEmail: string;
  purpose: EmailVerifyPurpose;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
}

// POST /verifications/email/confirm 응답
export interface EmailVerifyResponseDto {
  targetEmail: string;
  purpose: EmailVerifyPurpose;
  verified: boolean;
}

// POST /auth/password-reset/confirm
export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
  newPasswordConfirm: string;
  newPasswordMatched: boolean;
}

export interface ResetPasswordResponseDto {
  passwordReset: boolean;
  requiresLogin: boolean;
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  name: string;
}

export interface ReissueRequest {
  refreshToken: string;
}

export interface ReissueResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  name: string;
}

export interface LoginIdCheckResponseDto {
  login_id: string;
  available: boolean;
}
export interface ReferralCodeCheckResponseDto {
  referralCode: string;
  available: boolean;
  referrerName: string;
}

export interface SignupPayloadDto {
  loginId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  name: string;
  phone: string;
  birthDate: string;
  interestCategoryIds: number[];
  referralCode?: string | null;
  marketingConsent: boolean;
  emailConsent: boolean;
  aiConsent: boolean;
}

export interface SignupFormData {
  name: string;
  birth_date: string;
  phone: string;
  email: string;
  login_id: string;
  password: string;
  passwordConfirm: string;
}

export interface SignupStatusData {
  email_verified: boolean;
  isIdChecked: boolean;
  isIdAvailable: boolean;
  isVerificationSent: boolean;
}

export interface UserMe {
  id: number;
  name: string;
  loginId: string;
  email: string;
  phone: string;
  createdAt: string;
  birthDate: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'GUEST';
  status: string;
  emailVerified: boolean;
  referralCode: string;
  interestCategoryIds: number[];
  marketingConsent: boolean;
  emailConsent: boolean;
  aiConsent: boolean;
}
