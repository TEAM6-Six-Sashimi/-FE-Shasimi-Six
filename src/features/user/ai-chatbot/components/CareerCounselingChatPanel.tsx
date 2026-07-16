'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';
import { sendChatbotMessageAction } from '../actions';
import { ChatbotHistoryItem } from '../types';

interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
  isIntro?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'bot',
    text: '저는 여러분의 진로와 커리어 고민을 함께 고민하는 **AI 진로 상담사**입니다.😊',
  },
  {
    id: 2,
    role: 'bot',
    text: '진로, 취업, 대외활동, 대학원, 자격증, 직무 선택 등 **어떤 고민이든 편하게 이야기**해주세요.',
  },
  {
    id: 3,
    role: 'bot',
    text: '예를 들어 **이런 질문들을 할 수 있어요**.\n· 개발자로 취업하려면 어떤 스펙이 필요한가요?\n· 비전공자도 IT 직무에 지원할 수 있나요?\n· 대학원과 취업 중 어떤 선택이 나을까요?\n· 자격증은 어떤 것을 따는 게 좋을까요?\n· 포트폴리오는 어떻게 준비해야 하나요?\n· 직무 변경을 고려하고 있는데 어떻게 시작할까요?',
  },
  {
    id: 4,
    role: 'bot',
    text: '지금 가장 고민되는 것이 무엇인가요?',
  },
];

// 입력창 최소/최대 높이 - 한 줄일 땐 전송 버튼과 높이를 맞추고, 두 줄 분량부터는 그 이상 늘어나지 않고 내부 스크롤
const TEXTAREA_MIN_HEIGHT = 40;
const TEXTAREA_MAX_HEIGHT = 61;

// 답변을 타이핑치듯이 스트리밍으로 보여주기 위한 속도 설정
const TYPING_CHARS_PER_TICK = 2;
const TYPING_INTERVAL_MS = 45;
// 하드코딩된 안내 메시지들 사이의 간격
const INTRO_MESSAGE_GAP_MS = 400;

// **로 감싼 부분만 굵게 렌더링 (초기 안내 메시지의 강조 표시용)
function renderMessageText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

function BotAvatar() {
  return (
    <span className="mr-1.5">
      <Image src="/main/ai-chatbot-2.png" alt="" width={25} height={25} />
    </span>
  );
}

// 답변을 기다리는 동안 말풍선 자리에 보여줄 로딩 인디케이터
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <div className="bg-[#F3F4F6] border rounded-2xl rounded-tl-sm px-4 py-2 mt-2">
        <InlineDotsLoading />
      </div>
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export default function CareerCounselingChatPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isWaitingReply, setIsWaitingReply] = useState(false);
  const [streamingId, setStreamingId] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  // 새 메시지가 추가/갱신되거나 로딩 인디케이터가 뜨면 항상 맨 아래로 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isWaitingReply]);

  // 기본 한 줄 높이(전송 버튼과 동일)에서 시작해 두 줄 분량까지 자동으로 늘어나고, 그 이상은 내부 스크롤
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const needsScroll = el.scrollHeight > TEXTAREA_MAX_HEIGHT;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, TEXTAREA_MIN_HEIGHT), TEXTAREA_MAX_HEIGHT)}px`;
    el.style.overflowY = needsScroll ? 'auto' : 'hidden';
  }, [input]);

  // 특정 메시지의 text를 한 글자씩 채워가며 타이핑치듯이 보여줌
  const startTyping = (id: number, fullText: string, onDone?: () => void) => {
    setStreamingId(id);
    let index = 0;
    const timer = setInterval(() => {
      index = Math.min(fullText.length, index + TYPING_CHARS_PER_TICK);
      const revealed = fullText.slice(0, index);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: revealed } : m)));

      if (index >= fullText.length) {
        clearInterval(timer);
        intervalsRef.current.delete(timer);
        setStreamingId((current) => (current === id ? null : current));
        onDone?.();
      }
    }, TYPING_INTERVAL_MS);
    intervalsRef.current.add(timer);
  };

  // 하드코딩된 안내 메시지도 한 번에 뜨지 않고 순서대로 스트리밍으로 표시
  useEffect(() => {
    let cancelled = false;
    const intervals = intervalsRef.current;
    // React StrictMode에서 이 effect가 두 번 실행되는 경우를 대비해, 이번 실행에서 추가한 메시지만 기록해두고
    // cleanup 시 되돌린다 (그렇지 않으면 안내 메시지가 중복된 id로 두 번 쌓임)
    const addedIds: number[] = [];

    const playNext = (index: number) => {
      if (cancelled || index >= INITIAL_MESSAGES.length) return;
      const intro = INITIAL_MESSAGES[index];
      addedIds.push(intro.id);
      setMessages((prev) => [...prev, { id: intro.id, role: 'bot', text: '', isIntro: true }]);
      startTyping(intro.id, intro.text, () => {
        if (!cancelled) setTimeout(() => playNext(index + 1), INTRO_MESSAGE_GAP_MS);
      });
    };

    playNext(0);

    return () => {
      cancelled = true;
      intervals.forEach(clearInterval);
      intervals.clear();
      setMessages((prev) => prev.filter((m) => !addedIds.includes(m.id)));
      setStreamingId((current) => (current !== null && addedIds.includes(current) ? null : current));
    };
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    // 안내용 초기 메시지는 실제 대화가 아니므로 history에서 제외
    const history: ChatbotHistoryItem[] = messages
      .filter((m) => !m.isIntro)
      .map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text,
      }));

    setInput('');
    setIsSending(true);
    setIsWaitingReply(true);
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed }]);

    const result = await sendChatbotMessageAction(trimmed, history);
    const fullReply = result.success ? result.reply : result.message;
    const replyId = Date.now() + 1;

    setIsWaitingReply(false);
    setMessages((prev) => [...prev, { id: replyId, role: 'bot', text: '' }]);
    startTyping(replyId, fullReply, () => {
      setIsSending(false);
      // 전송 중 disabled로 인해 빠졌던 포커스를 입력창에 복원
      textareaRef.current?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 등 IME 조합 중 Enter로 조합을 확정하는 경우까지 전송으로 처리되지 않도록 방지
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-25 right-8 z-50 w-105 max-w-[calc(100vw-2rem)] h-[min(39.75rem,calc(100vh-7.5rem))] bg-white rounded-xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#F3F4F6] shrink-0">
        <Image src="/main/ai-chatbot-2.png" alt="" width={35} height={35} className="shrink-0" />
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-[#1E2125]">AI 진로 상담사 (핏봇)</h2>
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
                {renderMessageText(msg.text)}
                {msg.id === streamingId && (
                  <span className="inline-block w-1 h-3.5 bg-[#9CA3AF] ml-0.5 align-middle animate-pulse" />
                )}
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
        {isWaitingReply && <TypingIndicator />}
      </div>

      {/* 입력창 */}
      <div className="flex items-end gap-2 px-4 py-3 border-t border-[#F3F4F6] shrink-0">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="진로 고민을 편하게 입력해보세요"
          maxLength={2000}
          disabled={isSending}
          rows={1}
          className="flex-1 resize-none overflow-hidden py-2 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors disabled:opacity-60"
        />
        <button
          type="button"
          aria-label="메시지 보내기"
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:cursor-not-allowed ${
            input.trim() && !isSending ? 'bg-[#5B8DEE]' : 'bg-[#E5E7EB]'
          }`}
        >
          <Image
            src={input.trim() && !isSending ? '/chat/send-active.svg' : '/chat/send-inactive.svg'}
            alt="전송"
            width={18}
            height={18}
          />
        </button>
      </div>
    </div>
  );
}
