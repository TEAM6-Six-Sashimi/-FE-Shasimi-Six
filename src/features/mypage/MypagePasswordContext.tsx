'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MypagePasswordContextType {
  verifiedPassword: string | null;
  setVerifiedPassword: (password: string | null) => void;
}

const MypagePasswordContext = createContext<MypagePasswordContextType | null>(null);

// 확인된 비밀번호를 레이아웃 생명주기에 종속된 메모리 상태로 보관(새로고침/탭 종료 시에는 사라짐)
export function MypagePasswordProvider({ children }: { children: ReactNode }) {
  const [verifiedPassword, setVerifiedPassword] = useState<string | null>(null);

  return (
    <MypagePasswordContext.Provider value={{ verifiedPassword, setVerifiedPassword }}>
      {children}
    </MypagePasswordContext.Provider>
  );
}

export function useMypagePassword() {
  const context = useContext(MypagePasswordContext);
  if (!context) {
    throw new Error('useMypagePassword는 MypagePasswordProvider 안에서 사용해야 합니다.');
  }
  return context;
}
