'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white">
      <div className="w-16 h-16 rounded-full bg-[#FFEBEB] flex items-center justify-center">
        <span className="text-[#FF5E5E] text-[35px] font-bold">!</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-[72px] font-bold text-[#FF5E5E] leading-none">404</h1>
        <p className="text-[18px] font-semibold text-[#1E2125]">페이지를 찾을 수 없습니다.</p>
        <p className="text-[13.5px] text-[#6A7282]">
          찾으시는 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="px-6 py-2.5 h-auto border-2 border-[#D1D5DB] text-[14px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] hover:text-[#1E2125] cursor-pointer"
        >
          이전 페이지로 돌아가기
        </Button>
        <Button
          asChild
          className="px-6 py-2.5 h-auto bg-[#FF5E5E] hover:bg-[#D14848]! text-[14px] font-semibold text-white"
        >
          <Link href="/">홈으로 가기</Link>
        </Button>
      </div>
    </div>
  );
}
