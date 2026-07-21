'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { reissueAction, logoutAction } from '@/features/auth/actions';
import { ChatMessage } from '../types';

const WS_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/^http/, 'ws');
const RECONNECT_DELAY_MS = 3000; // 인증 실패 외의 일반적인 끊김에 대한 재연결 간격

async function fetchWsToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/ws-token');
    if (!res.ok) return null;
    const data = await res.json();
    return data.wsTicket as string;
  } catch {
    return null;
  }
}

export function useCoffeeChatSocket(enabled: boolean = true) {
  const clientRef = useRef<Client | null>(null);
  const hasRetriedReissueRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 로그인하지 않은 상태에서 /api/ws-token 401을 일반적인 일시 장애로 취급해 3초마다 무한 재시도
    // 로그인한 사용자만 연결을 시도
    if (!enabled) return;

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
        // 토큰 조회 자체가 실패 - 잠시 후 재시도
        scheduleReconnect();
        return;
      }

      const client = new Client({
        brokerURL: `${WS_BASE_URL}/ws-coffeechat`,
        connectHeaders: { Authorization: `Bearer ${wsTicket}` },
        reconnectDelay: 0,
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
            if (cancelled) return; // 재발급 대기 중 언마운트되면 로그아웃

            if (!result.success) {
              await logoutAction();
              return;
            }
            connect();
            return;
          }

          // 그 외 종료는 잠시 후 재연결
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
  }, [enabled]);

  // 특정 채팅방 구독. 구독 해제 함수는 방을 바꾸거나 컴포넌트가 사라질 때 호출
  // clientRef만 참조하므로 useCallback으로 감싸 렌더마다 재생성되지 않게 한다
  const subscribe = useCallback((chatId: number, onMessage: (message: ChatMessage) => void) => {
    const client = clientRef.current;
    if (!client || !client.connected) return () => {};

    const subscription = client.subscribe(
      `/user/queue/coffee-chats/${chatId}`,
      (frame: IMessage) => {
        onMessage(JSON.parse(frame.body));
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const sendMessage = useCallback((chatId: number, content: string) => {
    const client = clientRef.current;
    if (!client || !client.connected) return false;

    client.publish({
      destination: `/app/coffee-chats/${chatId}/messages`,
      body: JSON.stringify({ content }),
    });
    return true;
  }, []);

  return { isConnected, subscribe, sendMessage };
}
