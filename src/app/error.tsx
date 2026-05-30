'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white">
      <div className="w-16 h-16 rounded-full bg-[#FFEBEB] flex items-center justify-center">
        <span className="text-[#FF5E5E] text-[28px]">!</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[28px] font-bold text-[#FF5E5E]">ERROR</h1>
        <p className="text-[16px] font-semibold text-[#1E2125]">서버에 알 수 없는 오류가 발생했습니다.</p>
        <p className="text-[13.5px] text-[#6A7282]">오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg border-2 border-[#D1D5DB] text-[14px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
        >
          새로 고침
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-lg bg-[#FF5E5E] hover:bg-[#D14848] text-[14px] font-semibold text-white cursor-pointer transition-colors"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
}