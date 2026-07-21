'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { MAINTENANCE_EXCLUDED_PATHS } from '@/lib/maintenance-excluded-paths';
import { useMaintenancePolling } from './useMaintenancePolling';
import ServiceUnavailablePage from './ServiceUnavailablePage';

interface MaintenanceContextValue {
  isBlocked: boolean;
  message: string;
  setMaintenance: (blocked: boolean, message?: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextValue | undefined>(undefined);

interface MaintenanceProviderProps {
  isAdmin: boolean;
  children: ReactNode;
}

export function MaintenanceProvider({ isAdmin, children }: MaintenanceProviderProps) {
  const pathname = usePathname();
  const [isBlocked, setIsBlocked] = useState(false);
  const [message, setMessage] = useState('');

  const setMaintenance = (blocked: boolean, msg = '') => {
    setIsBlocked(blocked);
    setMessage(msg);
  };

  const isExcluded = isAdmin || MAINTENANCE_EXCLUDED_PATHS.includes(pathname);

  useMaintenancePolling((status) => {
    if (status.enabled) setMaintenance(true, status.message);
  }, !isExcluded && !isBlocked);

  if (isBlocked) {
    return <ServiceUnavailablePage message={message} onRecovered={() => setMaintenance(false)} />;
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
