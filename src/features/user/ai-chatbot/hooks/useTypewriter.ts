import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types';

// 스트리밍 속도 설정
export const TYPING_CHARS_PER_TICK = 2;
export const TYPING_INTERVAL_MS = 45;

export function useTypewriter(setMessages: Dispatch<SetStateAction<ChatMessage[]>>) {
  const [streamingId, setStreamingId] = useState<number | null>(null);
  const intervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

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

  // 컴포넌트가 사라지면 타이핑 중이던 interval도 모두 정리
  useEffect(() => {
    const intervals = intervalsRef.current;
    return () => {
      intervals.forEach(clearInterval);
      intervals.clear();
    };
  }, []);

  return { streamingId, setStreamingId, startTyping };
}
