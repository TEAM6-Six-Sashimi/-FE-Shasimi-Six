'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { sendChatbotMessageAction } from '../actions';
import { ChatbotHistoryItem, ChatMessage } from '../types';
import { useTypewriter } from '../hooks/useTypewriter';
import { useIntroMessages } from '../hooks/useIntroMessages';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

// 대화가 길어져도 history를 최근 15개까지만 잘라 보냄
const MAX_HISTORY_MESSAGES = 15;

// 높이 조절 기본값/제약
const DEFAULT_HEIGHT_PX = 636;
const MIN_HEIGHT_PX = 320;
const BOTTOM_MARGIN_PX = 120; // 뷰포트 상단 여유분

interface Props {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  height: number | null;
  setHeight: Dispatch<SetStateAction<number | null>>;
  onClose: () => void;
}

export default function CareerCounselingChatPanel({
  messages,
  setMessages,
  height,
  setHeight,
  onClose,
}: Props) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isWaitingReply, setIsWaitingReply] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const { streamingId, setStreamingId, startTyping } = useTypewriter(setMessages);
  const isIntroPlaying = useIntroMessages({
    setMessages,
    startTyping,
    setStreamingId,
    hasExistingMessages: messages.length > 0,
  });
  const { hasTTSSupport, speakingMessageId, toggleSpeak } = useSpeechSynthesis();

  // 새 메시지가 추가/갱신되거나 로딩 인디케이터가 뜨면 항상 맨 아래로 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isWaitingReply]);

  const isResponding = isSending || isIntroPlaying || streamingId !== null;

  // 상단 핸들을 드래그해서 높이 조절
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = panelRef.current?.getBoundingClientRect().height ?? DEFAULT_HEIGHT_PX;
    isDraggingRef.current = true;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const delta = startY - moveEvent.clientY;
      const maxHeight = window.innerHeight - BOTTOM_MARGIN_PX;
      setHeight(Math.min(Math.max(startHeight + delta, MIN_HEIGHT_PX), maxHeight));
    };
    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isResponding) return;

    // 안내용 초기 메시지는 실제 대화가 아니므로 history에서 제외하고, 최근 대화만 남김
    const history: ChatbotHistoryItem[] = messages
      .filter((m) => !m.isIntro)
      .slice(-MAX_HISTORY_MESSAGES)
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
      chatInputRef.current?.focus();
    });
  };

  return (
    <div
      ref={panelRef}
      style={height ? { height: `${height}px` } : undefined}
      className={`fixed bottom-25 right-8 z-50 w-105 max-w-[calc(100vw-2rem)] ${
        height ? '' : 'h-[min(39.75rem,calc(100vh-7.5rem))]'
      } bg-white rounded-xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden`}
    >
      {/* 높이 조절 핸들 */}
      <div
        onPointerDown={handleResizeStart}
        role="separator"
        aria-orientation="horizontal"
        aria-label="채팅창 높이 조절"
        className="h-2.5 w-full shrink-0 flex items-center justify-center cursor-ns-resize touch-none group"
      >
        <span className="w-10 h-1 rounded-full bg-[#D1D5DB] group-hover:bg-[#9CA3AF] transition-colors" />
      </div>

      <ChatHeader />

      {/* 메시지 목록 */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-[#F9FAFB]"
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isStreaming={msg.id === streamingId}
            hasTTSSupport={hasTTSSupport}
            isSpeaking={speakingMessageId === msg.id}
            onToggleSpeak={toggleSpeak}
          />
        ))}
        {isWaitingReply && <TypingIndicator />}
      </div>

      <ChatInput
        ref={chatInputRef}
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={isResponding}
      />
    </div>
  );
}
