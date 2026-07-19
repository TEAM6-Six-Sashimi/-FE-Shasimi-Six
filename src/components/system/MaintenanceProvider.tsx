'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchMaintenanceStatus } from '@/services/maintenance.service';
import ServiceUnavailablePage from './ServiceUnavailablePage';

interface MaintenanceContextValue {
  isBlocked: boolean;
  message: string;
  setMaintenance: (blocked: boolean, message?: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextValue | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [message, setMessage] = useState('');

  const setMaintenance = (blocked: boolean, msg = '') => {
    setIsBlocked(blocked);
    setMessage(msg);
  };

  useEffect(() => {
    fetchMaintenanceStatus()
      .then((data) => {
        if (data.enabled) setMaintenance(true, data.message);
      })
      .catch(() => {
        // 이 요청 자체가 실패해도 여기선 무시 (미들웨어가 페이지 단위로 이미 걸러줌)
      });
  }, []);

  if (isBlocked) {
    return (
      <ServiceUnavailablePage message={message} onRecovered={() => setMaintenance(false)} />
    );
  }

  return (
    <MaintenanceContext.Provider value={{ isBlocked, message, setMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) throw new Error('useMaintenance는 MaintenanceProvider 안에서 사용해야 합니다.');
  return ctx;
}
