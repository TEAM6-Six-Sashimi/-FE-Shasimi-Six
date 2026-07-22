export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
}

// 백엔드에 직접 묻는 대신 캐시가 걸린 내부 라우트를 거침 -
// 실제 백엔드 조회는 서버 인스턴스당 5초에 한 번으로 묶임
export async function fetchMaintenanceStatus(): Promise<MaintenanceStatus> {
  const res = await fetch('/api/maintenance-status');
  return res.json();
}

// 점검모드 중 API 응답(503 + errorCode: COMMON_900)을 감지하기 위한 전용 에러 타입
export class MaintenanceError extends Error {}

// 응답이 점검모드로 인한 503인지 확인 (에러코드까지 함께 확인)
export async function parseMaintenanceMessage(res: Response): Promise<string | null> {
  if (res.status !== 503) return null;

  const body = await res
    .clone()
    .json()
    .catch(() => null);

  if (body?.errorCode !== 'COMMON_900') return null;
  return body.message ?? '새 버전을 배포하고 있습니다. 잠시 후 다시 이용해주세요.';
}
