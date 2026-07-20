'use client';

import { useEffect, useRef, useState } from 'react';
import { sendChatbotMessageAction } from '../actions';
import { ChatbotHistoryItem, ChatMessage } from '../types';
import { useTypewriter } from '../hooks/useTypewriter';
import { useIntroMessages } from '../hooks/useIntroMessages';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';

// 대화가 길어져도 매 전송마다 백엔드로 보내는 history 크기가 무한정 커지지 않도록 최근 N개까지만 자른다.
const MAX_HISTORY_MESSAGES = 15;

interface Props {
  onClose: () => void;
}

export default function CareerCounselingChatPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isWaitingReply, setIsWaitingReply] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const { streamingId, setStreamingId, startTyping } = useTypewriter(setMessages);
  const isIntroPlaying = useIntroMessages({ setMessages, startTyping, setStreamingId });
  const { hasTTSSupport, speakingMessageId, toggleSpeak } = useSpeechSynthesis();

  // 새 메시지가 추가/갱신되거나 로딩 인디케이터가 뜨면 항상 맨 아래로 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isWaitingReply]);

  // 하드코딩된 안내 메시지 시퀀스 전체(isIntroPlaying, 메시지 사이 대기 시간 포함)와
  // 실제 응답을 기다리거나 타이핑하는 동안(isSending) 모두 "응답 중"으로 보고,
  // 이 시간에는 전송만 막는다 (입력창 자체는 계속 타이핑 가능하게 열어둠)
  const isResponding = isSending || isIntroPlaying || streamingId !== null;

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isResponding) return;

    // 안내용 초기 메시지는 실제 대화가 아니므로 history에서 제외하고, 최근 대화만 남긴다
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
    <div className="fixed bottom-25 right-8 z-50 w-105 max-w-[calc(100vw-2rem)] h-[min(39.75rem,calc(100vh-7.5rem))] bg-white rounded-xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden">
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
