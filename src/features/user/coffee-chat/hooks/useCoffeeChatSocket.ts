'use client';

import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { reissueAction, logoutAction } from '@/features/auth/actions';
import { ChatMessage } from '../types';

const WS_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/^http/, 'ws');

async function fetchWsToken(): Promise<string | null> {
  const res = await fetch('/api/ws-token');
  if (!res.ok) return null;
  const data = await res.json();
  return data.accessToken as string;
}

export function useCoffeeChatSocket() {
  const clientRef = useRef<Client | null>(null);
  const hasRetriedReissueRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function connect() {
      const accessToken = await fetchWsToken();
      if (cancelled || !accessToken) return;

      const client = new Client({
        brokerURL: `${WS_BASE_URL}/ws-coffeechat`,
        connectHeaders: { Authorization: `Bearer ${accessToken}` },
        reconnectDelay: 0, // 재연결은 아래 onWebSocketClose에서 직접 제어
        onConnect: () => {
          hasRetriedReissueRef.current = false;
          setIsConnected(true);
        },
        onWebSocketClose: async (event) => {
          setIsConnected(false);
          if (cancelled) return;

          if (event.code === 1002 && !hasRetriedReissueRef.current) {
            hasRetriedReissueRef.current = true;
            const result = await reissueAction();
            if (!result.success) {
              await logoutAction();
              return;
            }
            connect();
          }
        },
      });

      clientRef.current = client;
      client.activate();
    }

    connect();

    return () => {
      cancelled = true;
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
