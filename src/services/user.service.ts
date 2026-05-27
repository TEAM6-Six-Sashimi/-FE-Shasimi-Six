// 회원 정보 서비스 (마이페이지-개인정보 / 비번 변경 / 탈퇴)
import type {
  UserResponseDto,
  UpdateMyInfoRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  WithdrawUserRequest,
  WithdrawUserResponse,
} from '@/features/user/myinfo/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// 내 정보 조회
export async function getMyInfo(): Promise<UserResponseDto> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: authHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('로그인이 필요합니다.');
    throw new Error('내 정보를 불러오지 못했습니다.');
  }
  return response.json();
}

// 내 정보 수정 (이름/이메일)
export async function updateMyInfo(
  payload: UpdateMyInfoRequest,
): Promise<UserResponseDto> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 400) {
      throw new Error(error.message || '현재 비밀번호가 일치하지 않습니다.');
    }
    if (response.status === 409) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }
    throw new Error(error.message || '내 정보 수정에 실패했습니다.');
  }
  return response.json();
}

// 비밀번호 변경
export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const response = await fetch(`${API_BASE_URL}/users/me/password`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 400) {
      throw new Error(
        error.message || '현재 비밀번호가 일치하지 않거나 기존 비밀번호와 동일합니다.',
      );
    }
    throw new Error(error.message || '비밀번호 변경에 실패했습니다.');
  }
  return response.json();
}

// 회원 탈퇴
export async function withdrawUser(
  payload: WithdrawUserRequest,
): Promise<WithdrawUserResponse> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'DELETE',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 400) {
      throw new Error(error.message || '현재 비밀번호가 일치하지 않습니다.');
    }
    throw new Error(error.message || '회원 탈퇴에 실패했습니다.');
  }
  return response.json();
}
