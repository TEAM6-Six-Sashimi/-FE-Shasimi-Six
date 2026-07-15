'use client';

import Image from 'next/image';
import CoffeeChatSidebar from './CoffeeChatSidebar';
import { UserMe } from '@/features/auth/types';

interface CoffeeChatPageClientProps {
  role: UserMe['role'];
}

export default function CoffeeChatPageClient({ role }: CoffeeChatPageClientProps) {
  return (
    <div className="flex bg-white h-[calc(100vh-140px)] min-h-[640px]">
      <div className="shrink-0 w-[500px]">
        <CoffeeChatSidebar role={role} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-[#F9FAFB]">
        <Image
          src='/chat/chat-inactive.svg'
          alt=""
          width={50}
          height={50}
        />
        <p className="text-[14px] text-[#9CA3AF]">시작할 채팅을 선택해주세요.</p>
      </div>
    </div>
  );
}
