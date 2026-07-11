// 회원 서비스(로그인/회원가입)
import {
  LoginRequest,
  LoginResponse,
  ReissueResponse,
  EmailVerifyPurpose,
  EmailVerificationRequestResponseDto,
  EmailVerifyResponseDto,
  LoginIdCheckResponseDto,
  ReferralCodeCheckResponseDto,
  SignupPayloadDto,
  ResetPasswordPayload,
  ResetPasswordResponseDto,
} from '@/features/auth/types';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 이메일 인증 요청 (회원가입/비밀번호 재설정 등 공용, purpose로 목적 구분)
export async function sendEmailVerification(
  email: string,
  purpose: EmailVerifyPurpose = 'SIGNUP',
): Promise<EmailVerificationRequestResponseDto> {
  const response = await fetch(`${API_BASE_URL}/verifications/email/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetEmail: email,
      purpose,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('인증번호 재요청 제한 시간이 걸려있습니다. 잠시 후 다시 시도해 주세요.');
    }
    throw new Error('인증번호 발송에 실패했습니다. 이메일 주소를 확인해 주세요.');
  }

  return response.json();
}

export async function verifyEmailCode(
  email: string,
  code: string,
  purpose: EmailVerifyPurpose = 'SIGNUP',
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/verifications/email/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      targetEmail: email,
      code: code,
      purpose,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || '인증번호 확인 중 서버 오류가 발생했습니다.');
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

// 추천인 코드 확인
export async function checkReferralCode(
  referralCode: string,
): Promise<ReferralCodeCheckResponseDto> {
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

  return response.json();
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

  return response.ok;
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
    const authMessage = await parseAuthErrorMessage(response);
    throw new Error(authMessage ?? '토큰 재발급에 실패했습니다.');
  }

  return response.json();
}

// 비밀번호 재설정 (이메일 인증코드 + 새 비밀번호)
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponseDto> {
  const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    if (errorBody.message) {
      throw new Error(errorBody.message);
    }
    if (response.status === 403) {
      throw new Error('비활성화된 계정입니다. 관리자에게 문의해주세요.');
    }
    if (response.status === 404) {
      throw new Error('인증 요청 내역 또는 사용자를 찾을 수 없습니다. 인증을 다시 시도해주세요.');
    }
    throw new Error(
      '비밀번호 재설정에 실패했습니다. 인증코드가 만료되었거나 일치하지 않을 수 있습니다.',
    );
  }

  return response.json();
}
