'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const HOVER_MESSAGE = '진로에 대한 갈피를 못잡겠어? 핏봇에게 물어봐';
const TYPE_INTERVAL_MS = 8;

// 진로 상담 챗봇 - 지금은 UI만 배치, 실제 채팅 연동은 추후 진행
export default function CareerCounselingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [typedText, setTypedText] = useState('');

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

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
      <span className="px-3 py-1.5 rounded-full bg-[#1E2125] text-white text-[12px] font-semibold shadow-md translate-x-2">
        진로 상담
      </span>
      <button
        type="button"
        aria-label="진로 상담 챗봇 열기"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`h-14 min-w-14 rounded-full bg-[#5B8DEE] text-white inline-flex items-center justify-center shrink-0 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
          isHovered
            ? 'max-w-90 px-5 gap-2 shadow-lg'
            : 'max-w-14 px-0 shadow-lg'
        }`}
      >
        <Image
          src="/main/ai-chatbot-Icon.svg"
          alt=""
          width={26}
          height={26}
          className="shrink-0"
        />
        {isHovered && (
          <span className="text-[14px] font-semibold whitespace-nowrap">{typedText}</span>
        )}
      </button>
    </div>
  );
}
