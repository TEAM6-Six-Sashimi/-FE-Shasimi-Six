'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'positive' | 'negative' | 'alarm'

interface Toast {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_STYLES: Record<ToastType, string> = {
  positive: 'bg-[#F9FBE7] text-[#827717] border-[#827717]',
  negative: 'bg-[#FFEBEB] text-[#D14848] border-[#D14848]',
  alarm: 'bg-[#FEF3C7] text-[#92400E] border-[#92400E]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

const showToast = (message: string, type: ToastType = 'positive') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // 5초 후 자동 사라짐
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed top-26 left-1/2 -translate-x-1/2 z-50"> {/* 높이 고정할지 고민 중.. 현재는 상단 메뉴바 아래로 뜸 */}
          <div className={`min-w-100 rounded-md px-8 py-2 font-semibold border-[1.5px] text-center text-[14px] shadow-lg  ${TOAST_STYLES[toast.type]}`}>
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast는 ToastProvider 안에서 사용해야 합니다.');
  return context;
};