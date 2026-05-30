'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white">
      <div className="w-16 h-16 rounded-full bg-[#FFEBEB] flex items-center justify-center">
        <span className="text-[#FF5E5E] text-[28px]">!</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[72px] font-bold text-[#FF5E5E] leading-none">404</h1>
        <p className="text-[18px] font-semibold text-[#1E2125]">페이지를 찾을 수 없습니다.</p>
        <p className="text-[13.5px] text-[#6A7282]">찾으시는 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg border-2 border-[#D1D5DB] text-[14px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
        >
          이전 페이지로 돌아가기
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