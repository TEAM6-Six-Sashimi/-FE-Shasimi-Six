export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresIn?: number;
  grantType?: string;
  name?: string;
  role?: string;
}