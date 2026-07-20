// proxy.ts(서버 미들웨어)와 MaintenanceProvider(클라이언트)가 동일한 점검모드 예외 경로를
// 공유하기 위한 상수. 서버/클라이언트 어느 쪽에서 import해도 안전하도록 순수 배열만 export한다.
// 로그인 페이지 자체와 점검 안내 페이지는 점검모드 차단 대상에서 제외한다
// (안 그러면 무한 리다이렉트 or 점검 중 로그인이 안 됨).
export const MAINTENANCE_EXCLUDED_PATHS = ['/maintenance', '/auth/login'];
