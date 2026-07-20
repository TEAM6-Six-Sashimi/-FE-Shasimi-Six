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

// 상단 메뉴바의 커피챗 알림 점은 원래 레이아웃이 서버에서 계산한 값을 한 번만 받아서
// 페이지 이동 시에만 갱신됐다. 커피챗 페이지에서 실시간으로 메시지를 읽어 안읽음이
// 0이 되는 순간에도 바로 반영되도록, 메뉴바와 커피챗 페이지가 공유하는 클라이언트
// 상태로 승격한다.
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
