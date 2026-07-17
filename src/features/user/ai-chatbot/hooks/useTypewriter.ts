import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types';

// 답변을 타이핑치듯이 스트리밍으로 보여주기 위한 속도 설정
export const TYPING_CHARS_PER_TICK = 2;
export const TYPING_INTERVAL_MS = 45;

// 메시지 텍스트를 한 글자씩 채워가며 타이핑치듯이 보여주는 스트리밍 효과.
// 하드코딩된 안내 메시지와 실제 답변 모두 이 훅으로 재생한다.
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
