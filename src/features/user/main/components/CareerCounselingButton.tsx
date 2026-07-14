'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const HOVER_MESSAGE = '진로에 대한 갈피를 못잡겠어? 핏봇에게 물어봐';
const TYPE_INTERVAL_MS = 8;

// 챗봇 버튼을 숨길 페이지 - 커피챗, 강사 지원
const HIDDEN_PATH_PREFIXES = ['/coffee-chat', '/instructor-application', '/payments', '/mycourses-instructor'];

// 진로 상담 챗봇 - 지금은 UI만 배치, 실제 채팅 연동은 추후 진행
export default function CareerCounselingButton() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [typedText, setTypedText] = useState('');
  // 새로고침하면 다시 보이도록 저장소 없이 메모리 상태로만 관리 (페이지 이동 중에는 유지, 새로고침하면 초기화)
  const [isDismissed, setIsDismissed] = useState(false);

  // 호버 중일 때만 메시지를 한 글자씩 타이핑, 벗어나면 초기화해서 다음 호버 때 처음부터
  useEffect(() => {
    if (!isHovered) {
      setTypedText('');
      return;
    }

    let charCount = 0;
    const timer = setInterval(() => {
      charCount += 1;
      setTypedText(HOVER_MESSAGE.slice(0, charCount));
      if (charCount >= HOVER_MESSAGE.length) clearInterval(timer);
    }, TYPE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isHovered]);

  const isHidden =
    isDismissed || HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isHidden) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
      <span className="px-3 py-1.5 rounded-full bg-[#1E2125] text-white text-[12px] font-semibold shadow-md translate-x-2.5">
        진로 상담
      </span>
      <div className="relative">
        <button
          type="button"
          aria-label="진로 상담 챗봇 열기"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className={`h-14 min-w-14 rounded-full bg-[#EEF4FF] text-[#1E2125] inline-flex items-center justify-center shrink-0 transition-all duration-300 ease-out cursor-pointer overflow-hidden shadow-lg ${
            isHovered ? 'max-w-95 px-5 gap-2' : 'max-w-15 px-0'
          }`}
        >
          <Image src="/main/ai-chatbot-2.png" alt="" width={38} height={38} className="shrink-0" />
          {isHovered && (
            <span className="text-[14px] font-semibold whitespace-nowrap">{typedText}</span>
          )}
        </button>
        <button
          type="button"
          aria-label="진로 상담 챗봇 닫기"
          onClick={handleDismiss}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1E2125] text-white flex items-center justify-center text-[10px] shadow-md hover:bg-[#374151] transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
