import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { INITIAL_MESSAGES, INTRO_MESSAGE_GAP_MS } from '../constants';

interface Params {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  startTyping: (id: number, fullText: string, onDone?: () => void) => void;
  setStreamingId: Dispatch<SetStateAction<number | null>>;
}

// 하드코딩된 안내 메시지도 한 번에 뜨지 않고 순서대로 스트리밍으로 표시
export function useIntroMessages({ setMessages, startTyping, setStreamingId }: Params) {
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // React StrictMode에서 이 effect가 두 번 실행되는 경우를 대비해, 이번 실행에서 추가한 메시지만 기록해두고
    // cleanup 시 되돌린다 (그렇지 않으면 안내 메시지가 중복된 id로 두 번 쌓임)
    const addedIds: number[] = [];

    const playNext = (index: number) => {
      if (cancelled) return;
      if (index >= INITIAL_MESSAGES.length) {
        // 안내 메시지 사이 대기 시간(INTRO_MESSAGE_GAP_MS) 동안에는 streamingId가 잠깐 null이 되므로,
        // 전체 안내 시퀀스가 끝났는지는 이 플래그로 따로 표시한다
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isIntroPlaying;
}
