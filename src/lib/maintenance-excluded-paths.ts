// proxy.ts와 MaintenanceProvider(클라이언트)가 동일한 점검모드 예외 경로를 공유하기 위한 상수
// 서버/클라이언트 어느 쪽에서 import해도 안전하도록 순수 배열만 export
export const MAINTENANCE_EXCLUDED_PATHS = ['/maintenance', '/auth/login'];
