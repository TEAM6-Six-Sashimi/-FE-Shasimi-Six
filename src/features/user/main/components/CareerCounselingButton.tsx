'use client';

import Image from 'next/image';

// 진로 상담 챗봇 - 지금은 UI만 배치, 실제 채팅 연동은 추후 진행
export default function CareerCounselingButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
      <span className="px-3 py-1.5 rounded-full bg-[#1E2125] text-white text-[12px] font-semibold shadow-md translate-x-2">
        진로 상담
      </span>
      <button
        type="button"
        aria-label="진로 상담 챗봇 열기"
        className="w-14 h-14 rounded-full bg-[#5B8DEE] hover:bg-[#4A7AD9] text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
      >
        <Image src="/main/ai-chatbot-Icon.svg" alt="" width={26} height={26} />
      </button>
    </div>
  );
}
