import { AuthErrorCode, AuthErrorResponseBody } from './types';

// AUTH_008(다른 기기 로그인)은 백엔드가 내려주는 문구를 그대로 쓰고,
// 나머지는 사용자에게 원인을 정확히 설명하기보다 다음 행동(재로그인)을 안내하는 문구로 고정한다.
const AUTH_ERROR_MESSAGES: Record<Exclude<AuthErrorCode, 'AUTH_008'>, string> = {
  AUTH_001: '로그인이 필요합니다.',
  AUTH_003: '토큰 재발급에 실패했습니다.',
  AUTH_004: '토큰 재발급에 실패했습니다.',
  AUTH_005: '로그인 유효시간이 만료되었습니다.',
};

/**
 * 401 응답 바디에서 세션이 완전히 죽은 상태(AUTH_00X)인지 확인하고 안내 메시지를 뽑아낸다.
 * next/headers 등 서버 전용 모듈을 쓰지 않는 순수 파싱 함수라 클라이언트에서 직접 fetch하는
 * 코드(auth.service.ts 등)에서도 안전하게 재사용할 수 있다.
 */
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
