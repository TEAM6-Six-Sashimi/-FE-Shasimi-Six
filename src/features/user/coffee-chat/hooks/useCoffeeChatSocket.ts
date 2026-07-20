'use client';

import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { reissueAction, logoutAction } from '@/features/auth/actions';
import { ChatMessage } from '../types';

const WS_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/^http/, 'ws');
const RECONNECT_DELAY_MS = 3000; // 인증 실패(1002) 외의 일반적인 끊김에 대한 재연결 간격

async function fetchWsToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/ws-token');
    if (!res.ok) return null;
    const data = await res.json();
    return data.wsTicket as string;
  } catch {
    return null; // 오프라인 등 네트워크 자체 실패 - 호출부에서 재시도하도록 null 리턴
  }
}

export function useCoffeeChatSocket() {
  const clientRef = useRef<Client | null>(null);
  const hasRetriedReissueRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function scheduleReconnect() {
      if (cancelled) return;
      reconnectTimerRef.current = setTimeout(() => {
        if (!cancelled) connect();
      }, RECONNECT_DELAY_MS);
    }

    async function connect() {
      const wsTicket = await fetchWsToken();
      if (cancelled) return;

      if (!wsTicket) {
        // 토큰 조회 자체가 실패(오프라인, 서버 오류 등) - 잠시 후 재시도
        scheduleReconnect();
        return;
      }

      const client = new Client({
        brokerURL: `${WS_BASE_URL}/ws-coffeechat`,
        connectHeaders: { Authorization: `Bearer ${wsTicket}` },
        reconnectDelay: 0, // 재연결은 아래 onWebSocketClose에서 직접 제어
        onConnect: () => {
          hasRetriedReissueRef.current = false;
          setIsConnected(true);
        },
        onWebSocketClose: async (event) => {
          setIsConnected(false);
          if (cancelled) return;

          if (event.code === 1002) {
            if (hasRetriedReissueRef.current) return; // 재발급 후에도 또 실패 - 포기
            hasRetriedReissueRef.current = true;

            const result = await reissueAction();
            if (cancelled) return; // 재발급 대기 중 언마운트되면 로그아웃/재연결을 하지 않는다

            if (!result.success) {
              await logoutAction();
              return;
            }
            connect();
            return;
          }

          // 그 외 종료(네트워크 단절, 서버 재시작, 프록시 타임아웃 등)는 잠시 후 재연결
          scheduleReconnect();
        },
      });

      clientRef.current = client;
      client.activate();
    }

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, []);

  // 특정 채팅방 구독. 반환값(구독 해제 함수)은 방을 바꾸거나 컴포넌트가 사라질 때 호출할 것.
  function subscribe(chatId: number, onMessage: (message: ChatMessage) => void) {
    const client = clientRef.current;
    if (!client || !client.connected) return () => {};

    const subscription = client.subscribe(
      `/user/queue/coffee-chats/${chatId}`,
      (frame: IMessage) => {
        onMessage(JSON.parse(frame.body));
      },
    );

    return () => subscription.unsubscribe();
  }

  function sendMessage(chatId: number, content: string) {
    const client = clientRef.current;
    if (!client || !client.connected) return false;

    client.publish({
      destination: `/app/coffee-chats/${chatId}/messages`,
      body: JSON.stringify({ content }),
    });
    return true;
  }

  return { isConnected, subscribe, sendMessage };
}
