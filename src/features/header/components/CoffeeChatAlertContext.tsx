'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CoffeeChatAlertContextValue {
  hasAlert: boolean;
  setHasAlert: (hasAlert: boolean) => void;
}

const CoffeeChatAlertContext = createContext<CoffeeChatAlertContextValue | undefined>(undefined);

interface CoffeeChatAlertProviderProps {
  initialHasAlert: boolean;
  children: ReactNode;
}

// 커피챗 페이지에서 실시간으로 메시지를 읽어 안읽음이 바로 반영되도록, 메뉴바와 커피챗 페이지가 공유하는 클라이언트 상태로 승격
export function CoffeeChatAlertProvider({
  initialHasAlert,
  children,
}: CoffeeChatAlertProviderProps) {
  const [hasAlert, setHasAlert] = useState(initialHasAlert);

  return (
    <CoffeeChatAlertContext.Provider value={{ hasAlert, setHasAlert }}>
      {children}
    </CoffeeChatAlertContext.Provider>
  );
}

export function useCoffeeChatAlert() {
  const ctx = useContext(CoffeeChatAlertContext);
  if (!ctx) throw new Error('useCoffeeChatAlert는 CoffeeChatAlertProvider 안에서 사용해야 합니다.');
  return ctx;
}
