'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import CareerCounselingChatPanel from './CareerCounselingChatPanel';

const HOVER_MESSAGE = '진로에 대한 갈피를 못잡겠어? 핏봇에게 물어봐';
const TYPE_INTERVAL_MS = 8;

// 챗봇 버튼을 숨길 페이지 - 커피챗, 강사 지원, 장바구니, 결제페이지, 강사-내강의
const HIDDEN_PATH_PREFIXES = [
  '/coffee-chat',
  '/instructor-application',
  '/cart',
  '/payments',
  '/mycourses-instructor',
];

// 진로 상담 챗봇 - 실제 AI 응답 연동 전까지는 임시 응답으로 UI만 동작
export default function CareerCounselingButton() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  // 새로고침하면 다시 보이도록 저장소 없이 메모리 상태로만 관리 (페이지 이동 중에는 유지, 새로고침하면 초기화)
  const [isDismissed, setIsDismissed] = useState(false);

  // 호버 중일 때만 메시지를 한 글자씩 타이핑, 벗어나면 초기화해서 다음 호버 때 처음부터
  useEffect(() => {
    if (!isHovered || isChatOpen) {
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
  }, [isHovered, isChatOpen]);

  // 채팅창을 연 상태로 페이지를 이동하면 다음 방문 때 당황스러우니 경로가 바뀌면 닫아둔다
  useEffect(() => {
    setIsChatOpen(false);
  }, [pathname]);

  const isHidden =
    isDismissed || HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isHidden) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
  };

  return (
    <>
      {isChatOpen && <CareerCounselingChatPanel onClose={() => setIsChatOpen(false)} />}

      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
        {!isChatOpen && (
          <span className="px-3 py-1.5 rounded-full bg-[#1E2125] text-white text-[12px] font-semibold shadow-md translate-x-2.5">
            진로 상담
          </span>
        )}
        <div className="relative">
          <button
            type="button"
            aria-label={isChatOpen ? '진로 상담 챗봇 닫기' : '진로 상담 챗봇 열기'}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            onClick={() => setIsChatOpen((prev) => !prev)}
            className={`h-14 min-w-14 rounded-full inline-flex items-center justify-center shrink-0 transition-all duration-300 ease-out cursor-pointer overflow-hidden shadow-lg ${
              isChatOpen ? 'bg-[#1E2125] text-white max-w-15 px-0' : 'bg-[#EEF4FF] text-[#1E2125]'
            } ${!isChatOpen && isHovered ? 'max-w-95 px-5 gap-2' : !isChatOpen ? 'max-w-15 px-0' : ''}`}
          >
            {isChatOpen ? (
              <span className="text-[20px] leading-none">✕</span>
            ) : (
              <>
                <Image
                  src="/main/ai-chatbot-2.png"
                  alt=""
                  width={38}
                  height={38}
                  className="shrink-0"
                />
                {isHovered && (
                  <span className="text-[14px] font-semibold whitespace-nowrap">{typedText}</span>
                )}
              </>
            )}
          </button>
          {!isChatOpen && (
            <button
              type="button"
              aria-label="진로 상담 버튼 숨기기"
              onClick={handleDismiss}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1E2125] text-white flex items-center justify-center text-[10px] shadow-md hover:bg-[#374151] transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </>
  );
}
