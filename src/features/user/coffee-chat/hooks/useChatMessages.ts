'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { ChatMessage, ChatMessageEvent } from '../types';

// 채팅방의 첫 메시지는 강사 요청 목록 반영 등 서버 쪽 추가 처리가 붙어서
// 이후 메시지보다 왕복이 더 걸리는 경우가 있어 6초
const SEND_TIMEOUT_MS = 6000;

interface UseChatMessagesParams {
  chatId: number;
  myUserId: number;
  fetchMessages: (chatId: number) => Promise<ChatMessageEvent[]>;
  isConnected: boolean;
  subscribe: (chatId: number, onMessage: (message: ChatMessage) => void) => () => void;
  sendMessage: (chatId: number, content: string) => boolean;
  // 사이드바 목록의 최근 메시지 미리보기를 실시간으로 갱신하기 위한 콜백
  onMessage?: (message: ChatMessageEvent) => void;
}

// 학생/강사 채팅 패널이 공유하는 메시지 상태 및 송수신 로직
// (히스토리 로드+병합, 실시간 구독, 전송 타임아웃, 스크롤, 전송 처리)
export function useChatMessages({
  chatId,
  myUserId,
  fetchMessages,
  isConnected,
  subscribe,
  sendMessage,
  onMessage,
}: UseChatMessagesParams) {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ChatMessageEvent[]>([]);
  const [input, setInput] = useState('');
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  // 최신 값을 읽기 위해 ref로 따로 추적
  const pendingContentRef = useRef<string | null>(null);
  useEffect(() => {
    pendingContentRef.current = pendingContent;
  }, [pendingContent]);

  // onMessage도 같은 이유로 ref에 담아 최신 함수 참조
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const lastReadMessageIdRef = useRef(0);

  function applyReadWatermark(list: ChatMessageEvent[]) {
    const watermark = lastReadMessageIdRef.current;
    if (watermark <= 0) return list;
    return list.map((m) =>
      m.senderId === myUserId && m.messageId <= watermark && !m.isRead ? { ...m, isRead: true } : m,
    );
  }

  // 방 진입 시 히스토리 로드
  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    setPendingContent(null);
    lastReadMessageIdRef.current = 0;

    fetchMessages(chatId).then((history) => {
      if (cancelled) return;

      // 히스토리 응답이 오기 전에 먼저 도착한 실시간 메시지가 있을 수 있어서, 그대로 덮어쓰지 않고 messageId 기준으로 병합
      setMessages((prev) => {
        const merged = [...history];
        for (const message of prev) {
          if (!merged.some((m) => m.messageId === message.messageId)) merged.push(message);
        }
        return applyReadWatermark(merged.sort((a, b) => a.messageId - b.messageId));
      });
    });

    return () => {
      cancelled = true;
    };
  }, [chatId, fetchMessages]);

  // 연결되면 실시간 구독
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe(chatId, (message) => {
      if (message.eventType === 'READ') {
        // 읽음 이벤트는 새 메시지로 그리지 않고, 내가 보낸 메시지 중 lastReadMessageId 이하인 것들의 읽음 표시만 갱신
        lastReadMessageIdRef.current = Math.max(
          lastReadMessageIdRef.current,
          message.lastReadMessageId,
        );
        setMessages((prev) => applyReadWatermark(prev));
        return;
      }

      setMessages((prev) => {
        if (prev.some((m) => m.messageId === message.messageId)) return prev;
        return applyReadWatermark([...prev, message]);
      });

      if (message.senderId === myUserId && message.content === pendingContentRef.current) {
        setPendingContent(null);
      }

      onMessageRef.current?.(message);
    });

    return unsubscribe;
  }, [isConnected, chatId]);

  // 전송 타임아웃 처리
  useEffect(() => {
    if (!pendingContent) return;

    const timer = setTimeout(() => {
      setInput(pendingContent);
      setPendingContent(null);
      showToast('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'negative');
    }, SEND_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [pendingContent, showToast]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const handleSend = () => {
    const content = input.trim();
    if (!content || pendingContent) return;

    const sent = sendMessage(chatId, content);
    if (!sent) {
      showToast('연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.', 'negative');
      return;
    }

    setPendingContent(content);
    setInput('');
  };

  return { messages, input, setInput, pendingContent, listEndRef, handleSend };
}
