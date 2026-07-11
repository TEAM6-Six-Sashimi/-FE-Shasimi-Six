// 세션이 완전히 죽어서(AUTH_00X) 실패한 경우를 다른 일반 실패와 구분하기 위한 에러 타입.
// 클라이언트 컴포넌트에서도 `instanceof AuthSessionError`로 판별해야 하므로,
// next/headers 등 서버 전용 모듈을 참조하지 않는 별도 파일로 분리한다.
export class AuthSessionError extends Error {}
