export interface EmailVerifyResponseDto {
  targetEmail: string;
  purpose: 'SIGNUP' | 'PASSWORD_RESET' | 'EMAIL_CHANGE';
  verified: boolean;
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

export interface UserMe {
  id: number;
  name: string;
  loginId: string;
  email: string;
  birthDate: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'GUEST';
  status: string;
  emailVerified: boolean;
  referralCode: string;
  interestCategoryIds: number[];
}
