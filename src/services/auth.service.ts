// 회원 서비스(로그인/회원가입)
import { LoginRequest, LoginResponse,
  ReissueResponse, EmailVerifyResponseDto,
  LoginIdCheckResponseDto, ReferralCodeCheckResponseDto,
  SignupPayloadDto
 } from '@/features/auth/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 회원가입 - 이메일 인증 요청
export async function sendEmailVerification(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/verifications/email/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetEmail: email,
      purpose: 'SIGNUP',
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('인증번호 재요청 제한 시간이 걸려있습니다. 잠시 후 다시 시도해 주세요.');
    }
    throw new Error('인증번호 발송에 실패했습니다. 이메일 주소를 확인해 주세요.');
  }
}

export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/verifications/email/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetEmail: email,
      code: code,
      purpose: 'SIGNUP',
    }),
  });

  if (!response.ok) {
    throw new Error('인증번호 확인 중 서버 오류가 발생했습니다.');
  }

  const data: EmailVerifyResponseDto = await response.json();
  return data.verified;
}

// 회원가입 - 아이디 중복 검사
export async function checkLoginIdDuplicate(loginId: string): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/auth/login-id/check?loginId=${encodeURIComponent(loginId)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 발생했습니다.');
  }

  const data: LoginIdCheckResponseDto = await response.json();
  return !data.available;
}

// 로그인
export async function loginService(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
    throw new Error(errorData.message || '로그인에 실패했습니다.');
  }

  return response.json();
}

export async function reissueService(refreshToken: string): Promise<ReissueResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/reissue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('토큰 재발급에 실패했습니다.');
  }

  return response.json();
}

// 추천인 코드 확인
export async function checkReferralCode(referralCode: string): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/auth/referral-code/check?referralCode=${encodeURIComponent(referralCode)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('네트워크 응답에 문제가 발생했습니다.');
  }

  const data: ReferralCodeCheckResponseDto = await response.json();
  return data.available;
}

// 회원가입 요청
export async function registerUser(payload: SignupPayloadDto): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return (response.ok)
}
