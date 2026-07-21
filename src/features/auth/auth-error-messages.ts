import { AuthErrorCode, AuthErrorResponseBody } from './types';
import { AuthSessionError } from './errors';

// AUTH_008(다른 기기 로그인)은 백엔드가 내려주는 문구 사용
// 나머지는 사용자에게 재로그인을 안내하는 문구로 고정
const AUTH_ERROR_MESSAGES: Record<Exclude<AuthErrorCode, 'AUTH_008'>, string> = {
  AUTH_001: '로그인이 필요합니다.',
  AUTH_003: '토큰 재발급에 실패했습니다.',
  AUTH_004: '토큰 재발급에 실패했습니다.',
  AUTH_005: '로그인 유효시간이 만료되었습니다.',
};

// 401 응답 바디에서 세션이 완전히 죽은 상태인지 확인하고 안내 메시지를 뽑아냄
// next/headers 등 서버 전용 모듈을 쓰지 않는 순수 파싱 함수라 클라이언트에서 직접 fetch하는 코드에서도 안전하게 재사용 가능
export async function parseAuthErrorMessage(res: Response): Promise<string | null> {
  if (res.status !== 401) return null;

  const body: AuthErrorResponseBody | null = await res
    .clone()
    .json()
    .catch(() => null);

  const code = body?.errorCode;
  if (!code) return null;

  if (code === 'AUTH_008') {
    return body?.message ?? '다른 기기에서 로그인되어 자동 로그아웃 되었습니다.';
  }
  return AUTH_ERROR_MESSAGES[code as Exclude<AuthErrorCode, 'AUTH_008'>] ?? null;
}

// 세션이 완전히 죽은 상태면 AuthSessionError를 던지고, 그 외 실패는 그냥 통과
export async function throwIfAuthSessionError(res: Response): Promise<void> {
  const authMessage = await parseAuthErrorMessage(res);
  if (authMessage) throw new AuthSessionError(authMessage);
}
