import { cookies } from 'next/headers';
import { parseAuthErrorMessage } from './auth-error-messages';
import { AuthSessionError } from './errors';

export { AuthSessionError } from './errors';

// 'use server' 액션 파일 안에서만 사용할 것
// next/headers를 쓰기 때문에 클라이언트에서도 직접 import되는 일반 서비스 모듈에 넣으면 빌드가 깨짐
// 그런 곳에서는 parseAuthErrorMessage(순수 파싱 버전)를 사용

// redirect()는 호출하지 않음
// 클라이언트가 이 메시지를 토스트로 보여준 뒤 다음 페이지 이동에서 자연스럽게 로그아웃 상태로 반영되도록 함
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

// use server 액션에서 사용
// AuthSessionError를 던진 채로 클라이언트 경계를 넘기면 React Flight 직렬화 과정에서
// 커스텀 에러 클래스가 평범한 Error로 바뀌어버려서 클라이언트의 instanceof 체크가 항상 실패
// 미리 잡아 안전한 값으로 변환
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
