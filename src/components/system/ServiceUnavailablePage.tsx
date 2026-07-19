'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ServiceUnavailablePage({ message }: { message: string }) {
  useEffect(() => {
    const timer = setTimeout(() => window.location.reload(), 20000); // 20초 후 자동 새로고침
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white">
      <div className="w-16 h-16 rounded-full bg-[#FFEBEB] flex items-center justify-center">
        <span className="text-[#FF5E5E] text-[35px] font-bold">!</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[28px] font-bold text-[#FF5E5E]">서비스 점검 중</h1>
        <p className="text-[16px] font-semibold text-[#1E2125]">
          서비스 이용이 잠시 어렵습니다
        </p>
        <p className="text-[13.5px] text-[#6A7282]">{message}</p>
      </div>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 h-auto border-2 border-[#D1D5DB] text-[14px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] hover:text-[#1E2125] cursor-pointer"
      >
        새로 고침
      </Button>
    </div>
  );
}
