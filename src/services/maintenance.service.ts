export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
}

export async function fetchMaintenanceStatus(): Promise<MaintenanceStatus> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/status`);
  return res.json();
}

// 점검모드 중 API 응답(503 + errorCode: COMMON_900)을 감지하기 위한 전용 에러 타입.
// next/headers 등 서버 전용 모듈을 쓰지 않는 순수 파싱 함수라 클라이언트에서 직접
// fetch하는 코드에서도 안전하게 재사용할 수 있다 (parseAuthErrorMessage와 동일한 이유).
export class MaintenanceError extends Error {}

/**
 * 응답이 점검모드로 인한 503(errorCode: COMMON_900)인지 확인한다.
 * 단순 status === 503만으로 판단하면 다른 이유의 503과 섞일 수 있으므로 반드시
 * errorCode까지 함께 확인한다. res.clone()을 써서 원본 응답의 바디는 그대로 남겨두므로,
 * 호출부는 이 체크 전후로 res.json()을 자유롭게 더 호출할 수 있다.
 */
export async function parseMaintenanceMessage(res: Response): Promise<string | null> {
  if (res.status !== 503) return null;

  const body = await res
    .clone()
    .json()
    .catch(() => null);

  if (body?.errorCode !== 'COMMON_900') return null;
  return body.message ?? '새 버전을 배포하고 있습니다. 잠시 후 다시 이용해주세요.';
}
