'use client';

import { useEffect } from 'react';
import { fetchMaintenanceStatus, MaintenanceStatus } from '@/services/maintenance.service';

const POLL_INTERVAL_MS = 5000; // 미들웨어의 점검 상태 캐시 TTL과 맞춤

// /maintenance/status를 POLL_INTERVAL_MS마다 폴링해서 결과를 onResult로 넘긴다.
export function useMaintenancePolling(
  onResult: (status: MaintenanceStatus) => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const check = async () => {
      try {
        const status = await fetchMaintenanceStatus();
        if (!cancelled) onResult(status);
      } catch {
        // 이 요청 자체가 실패해도 무시 - 다음 폴링에서 다시 시도
      }
    };

    check();
    const timer = setInterval(check, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [active]);
}
