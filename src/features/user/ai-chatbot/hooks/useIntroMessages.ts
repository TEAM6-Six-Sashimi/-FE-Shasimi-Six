import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { INITIAL_MESSAGES, INTRO_MESSAGE_GAP_MS } from '../constants';

interface Params {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  startTyping: (id: number, fullText: string, onDone?: () => void) => void;
  setStreamingId: Dispatch<SetStateAction<number | null>>;
}

// 하드코딩된 안내 메시지도 순서대로 스트리밍으로 표시
export function useIntroMessages({ setMessages, startTyping, setStreamingId }: Params) {
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const addedIds: number[] = [];

    const playNext = (index: number) => {
      if (cancelled) return;
      if (index >= INITIAL_MESSAGES.length) {
        setIsIntroPlaying(false);
        return;
      }
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
      setMessages((prev) => prev.filter((m) => !addedIds.includes(m.id)));
      setStreamingId((current) => (current !== null && addedIds.includes(current) ? null : current));
    };
  }, []);

  return isIntroPlaying;
}
