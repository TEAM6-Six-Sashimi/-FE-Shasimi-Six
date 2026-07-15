'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'bot',
    text: '저는 여러분의 진로와 커리어 고민을 함께 고민하는 AI 진로 상담사입니다.',
  },
  {
    id: 2,
    role: 'bot',
    text: '진로, 취업, 대외활동, 대학원, 자격증, 직무 선택 등 어떤 고민이든 편하게 이야기해주세요.',
  },
  {
    id: 3,
    role: 'bot',
    text: '예를 들어 이런 질문들을 할 수 있어요.\n· 개발자로 취업하려면 어떤 스펙이 필요한가요?\n· 비전공자도 IT 직무에 지원할 수 있나요?\n· 대학원과 취업 중 어떤 선택이 나을까요?\n· 자격증은 어떤 것을 따는 게 좋을까요?\n· 포트폴리오는 어떻게 준비해야 하나요?\n· 직무 변경을 고려하고 있는데 어떻게 시작할까요?',
  },
  {
    id: 4,
    role: 'bot',
    text: '지금 가장 고민되는 것이 무엇인가요?',
  },
];

// 실제 AI 응답 연동 전까지 임시로 보여줄 응답 (UI만 우선 배치, 연동은 추후 진행)
const PLACEHOLDER_REPLY =
  '좋은 질문이에요! 해당 고민에 대해 함께 생각해 볼게요. 조금 더 구체적으로 말씀해 주시면 더 도움이 될 것 같아요 😊';

function BotAvatar() {
  return (
    <span className="mr-1.5">
      <Image src="/main/ai-chatbot-2.png" alt="" width={25} height={25} />
    </span>
  );
}

interface Props {
  onClose: () => void;
}

export default function CareerCounselingChatPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가되면 항상 맨 아래로 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: trimmed },
      { id: Date.now() + 1, role: 'bot', text: PLACEHOLDER_REPLY },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 등 IME 조합 중 Enter로 조합을 확정하는 경우까지 전송으로 처리되지 않도록 방지
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-25 right-8 z-50 w-95 max-w-[calc(100vw-2rem)] min-h-[min(25rem,calc(100vh-8rem))] max-h-[min(39.75rem,calc(100vh-7.5rem))] bg-white rounded-xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#F3F4F6] shrink-0">
        <Image src="/main/ai-chatbot-2.png" alt="" width={35} height={35} className="shrink-0" />
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-[#1E2125]">AI 진로 상담사</h2>
          <p className="text-[12px] text-[#FF5E5E] font-semibold">
            창을 닫으면 대화 내용이 저장되지 않습니다.
          </p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1.5 bg-[#F9FAFB]">
        {messages.map((msg) =>
          msg.role === 'bot' ? (
            <div key={msg.id} className="flex items-start gap-2">
              <BotAvatar />
              <p className="max-w-68 bg-[#F3F4F6] text-[#1E2125] text-[13px] border leading-relaxed rounded-2xl rounded-tl-sm px-4 py-2.5 mt-2 whitespace-pre-line wrap-break-word">
                {msg.text}
              </p>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-end">
              <p className="max-w-70 bg-[#5B8DEE] text-white text-[13.5px] leading-relaxed rounded-2xl rounded-tr-sm px-4 py-2.5 whitespace-pre-line wrap-break-word">
                {msg.text}
              </p>
            </div>
          ),
        )}
      </div>

      {/* 입력창 */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[#F3F4F6] shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="진로 고민을 편하게 입력해보세요"
          className="flex-1 h-10 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors"
        />
        <button
          type="button"
          aria-label="메시지 보내기"
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
            input.trim() ? 'bg-[#5B8DEE]' : 'bg-[#E5E7EB]'
          }`}
        >
          <Image
            src={input.trim() ? '/chat/send-active.svg' : '/chat/send-inactive.svg'}
            alt="전송"
            width={18}
            height={18}
          />
        </button>
      </div>
    </div>
  );
}
