import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { INITIAL_MESSAGES, INTRO_MESSAGE_GAP_MS } from '../constants';

interface Params {
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  startTyping: (id: number, fullText: string, onDone?: () => void) => void;
  setStreamingId: Dispatch<SetStateAction<number | null>>;
  // 페이지 이동 등으로 창이 잠깐 숨겨졌다 복원된 경우, 이미 대화가 있으면 인트로를 다시 재생하지 않음
  hasExistingMessages: boolean;
}

// 하드코딩된 안내 메시지도 순서대로 스트리밍으로 표시
export function useIntroMessages({
  setMessages,
  startTyping,
  setStreamingId,
  hasExistingMessages,
}: Params) {
  const [isIntroPlaying, setIsIntroPlaying] = useState(!hasExistingMessages);

  useEffect(() => {
    if (hasExistingMessages) return;

    let cancelled = false;
    let finished = false;
    const addedIds: number[] = [];

    const playNext = (index: number) => {
      if (cancelled) return;
      if (index >= INITIAL_MESSAGES.length) {
        finished = true;
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
      // 인트로가 끝까지 재생된 뒤 언마운트된 경우(숨김 페이지 이동 등)에는 
      // 이미 완성된 안내 메시지를 그대로 남겨두고, 재생 도중 끊긴 경우에만 미완성 메시지를 정리한다
      if (finished) return;
      setMessages((prev) => prev.filter((m) => !addedIds.includes(m.id)));
      setStreamingId((current) => (current !== null && addedIds.includes(current) ? null : current));
    };
  }, []);

  return isIntroPlaying;
}
