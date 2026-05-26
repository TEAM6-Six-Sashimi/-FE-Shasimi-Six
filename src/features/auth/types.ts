export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  role: string;
}