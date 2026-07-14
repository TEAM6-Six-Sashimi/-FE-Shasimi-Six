'use client';

import { useEffect, useState } from 'react';
import { LoginStatsPeriod } from '../types';

type StatsActionResult<T> = { success: true; data: T[] } | { success: false; message: string };

// 관리자 대시보드 통계 차트(요일/시간대 토글) 공용 데이터 로딩 훅
export function useAdminStatsChart<T>(
  fetchAction: (period: LoginStatsPeriod) => Promise<StatsActionResult<T>>,
  initialPeriod: LoginStatsPeriod = 'hourly',
) {
  const [period, setPeriod] = useState<LoginStatsPeriod>(initialPeriod);
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');
    fetchAction(period)
      .then((result) => {
        if (!active) return;
        if (result.success) {
          setData(result.data);
        } else {
          setData([]);
          setError(result.message);
        }
      })
      .catch(() => {
        if (!active) return;
        setData([]);
        setError('통계를 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [period, fetchAction]);

  return { period, setPeriod, data, isLoading, error };
}
