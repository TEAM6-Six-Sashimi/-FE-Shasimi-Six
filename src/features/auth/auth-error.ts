import { cookies } from 'next/headers';
import { parseAuthErrorMessage } from './auth-error-messages';
import { AuthSessionError } from './errors';

export { AuthSessionError } from './errors';

/**
 * 백엔드 401 응답이 세션이 완전히 죽은 상태(AUTH_00X)인지 확인하고,
 * 맞다면 쿠키를 정리한 뒤 사용자에게 보여줄 메시지를 돌려준다.
 * 이 401과 무관한 실패(다른 상태 코드, 다른 errorCode)면 null을 반환하니
 * 호출부는 기존 에러 처리를 그대로 이어가면 된다.
 *
 * 'use server' 액션 파일 안에서만 사용할 것 - next/headers를 쓰기 때문에
 * 클라이언트에서도 직접 import되는 일반 서비스 모듈(auth.service.ts 등)에 넣으면 빌드가 깨진다.
 * 그런 곳에서는 parseAuthErrorMessage(순수 파싱 버전)를 대신 쓴다.
 *
 * redirect()는 호출하지 않는다 - 클라이언트가 이 메시지를 토스트로 보여준 뒤
 * 다음 페이지 이동에서 자연스럽게 로그아웃 상태로 반영되도록 한다.
 */
export async function handleAuthErrorResponse(res: Response): Promise<string | null> {
  const message = await parseAuthErrorMessage(res);
  if (!message) return null;

  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('role');
  cookieStore.delete('accessTokenExpiresAt');

  return message;
}

/**
 * 클라이언트 컴포넌트가 직접 호출하는 'use server' 액션에서 쓴다.
 * AuthSessionError를 던진 채로 클라이언트 경계를 넘기면 React Flight 직렬화 과정에서
 * 커스텀 에러 클래스가 평범한 Error로 바뀌어버려서 클라이언트의 instanceof 체크가
 * 항상 실패한다 - 그래서 여기서 미리 잡아 안전한(직렬화 가능한) 값으로 변환해 돌려준다.
 */
export async function toActionResult<T>(
  fn: () => Promise<T>,
): Promise<{ success: true; data: T } | { success: false; authError?: true; message: string }> {
  try {
    return { success: true, data: await fn() };
  } catch (error) {
    return {
      success: false,
      authError: error instanceof AuthSessionError || undefined,
      message: error instanceof Error ? error.message : '요청에 실패했습니다.',
    };
  }
}
