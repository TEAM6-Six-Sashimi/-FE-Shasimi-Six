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
  FindIdVerificationRequestResponseDto,
  FindIdConfirmResponseDto,
} from '@/features/auth/types';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 백엔드 공통 에러 응답 형태 (timestamp/status/errorCode/message/path/traceId)
interface ApiErrorResponse {
  status?: number;
  errorCode?: string;
  message?: string;
  path?: string;
  traceId?: string;
}

// 실패 응답을 콘솔에 남겨서(특히 문서화되지 않은 상태코드) 백엔드에 전달할 근거를 확보
function logApiError(context: string, response: Response, errorBody: ApiErrorResponse) {
  console.error(
    `[${context}] status=${response.status} errorCode=${errorBody.errorCode ?? '-'} traceId=${
      errorBody.traceId ?? '-'
    } message=${errorBody.message ?? '-'}`,
  );
}

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

// 아이디 찾기 - 인증번호 발송
// 문서화된 응답: 400(요청값 형식 오류) / 403(비활성 회원) / 404(일치 회원 없음) / 429(1시간 3회 제한)
export async function sendFindIdVerification(
  name: string,
  email: string,
): Promise<FindIdVerificationRequestResponseDto> {
  const response = await fetch(`${API_BASE_URL}/auth/find-id/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json().catch(() => ({}));
    logApiError('sendFindIdVerification', response, errorBody);

    if (response.status === 400) {
      throw new Error(errorBody.message || '입력하신 정보의 형식을 확인해 주세요.');
    }
    if (response.status === 403) {
      throw new Error('비활성화된 계정입니다. 관리자에게 문의해주세요.');
    }
    if (response.status === 404) {
      throw new Error('이름과 이메일이 일치하는 회원을 찾을 수 없습니다.');
    }
    if (response.status === 429) {
      throw new Error('인증번호 요청 횟수를 초과했습니다(1시간 3회 제한). 잠시 후 다시 시도해 주세요.');
    }
    // 문서화되지 않은 상태코드(예: 500) - 서버가 준 메시지를 그대로 보여주되 콘솔에 근거를 남김
    throw new Error(
      errorBody.message || '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    );
  }

  return response.json();
}

// 아이디 찾기 - 인증번호 확인 (성공 시 loginId까지 함께 반환됨)
// 문서화된 응답: 400(코드 형식/만료/불일치) / 403(비활성 회원) / 404(일치 회원 없음) / 429(요청 초과)
export async function confirmFindId(
  name: string,
  email: string,
  code: string,
): Promise<FindIdConfirmResponseDto> {
  const response = await fetch(`${API_BASE_URL}/auth/find-id/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, code }),
  });

  if (!response.ok) {
    const errorBody: ApiErrorResponse = await response.json().catch(() => ({}));
    logApiError('confirmFindId', response, errorBody);

    if (response.status === 400) {
      throw new Error('인증번호가 올바르지 않거나 만료되었습니다. 다시 확인해주세요.');
    }
    if (response.status === 403) {
      throw new Error('비활성화된 계정입니다. 관리자에게 문의해주세요.');
    }
    if (response.status === 404) {
      throw new Error('이름과 이메일이 일치하는 회원을 찾을 수 없습니다.');
    }
    if (response.status === 429) {
      throw new Error('요청 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.');
    }
    throw new Error(errorBody.message || '인증번호 확인에 실패했습니다.');
  }

  return response.json();
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
