import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types';
import { stripMarkdown } from '@/lib/utils';

// 스피커 아이콘으로 메시지를 TTS(SpeechSynthesis)로 읽어주고, 읽는 중인 메시지를 다시 누르면 중지
export function useSpeechSynthesis() {
  const [hasTTSSupport, setHasTTSSupport] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  // 브라우저에 따라 getVoices()가 처음엔 빈 배열을 반환할 수 있어(비동기 로드),
  // voiceschanged 이벤트로 갱신되는 목록을 계속 최신 상태로 들고 있는다.
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // 브라우저의 TTS(SpeechSynthesis) 지원 여부 체크 + 음성 목록 로드
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') return;
    setHasTTSSupport(true);

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      voicesRef.current = synth.getVoices();
    };
    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    return () => synth.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // 채팅창을 닫거나 컴포넌트가 사라지면 읽던 음성도 함께 중단
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // MessageBubble이 React.memo로 감싸져 있어, 이 함수 참조가 매 렌더마다 바뀌면
  // 메모이제이션이 무력화되므로 useCallback으로 참조를 고정한다.
  const toggleSpeak = useCallback(
    (msg: ChatMessage) => {
      if (!hasTTSSupport) return;

      const synth = window.speechSynthesis;

      if (speakingMessageId === msg.id) {
        synth.cancel();
        setSpeakingMessageId(null);
        return;
      }

      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(stripMarkdown(msg.text).trim());
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      // 한국어 음성을 찾아 지정 (없으면 브라우저 기본 음성 사용)
      const koreanVoice = voicesRef.current.find((voice) => voice.lang.toLowerCase().startsWith('ko'));
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }
      utterance.onstart = () => setSpeakingMessageId(msg.id);
      utterance.onend = () => setSpeakingMessageId((current) => (current === msg.id ? null : current));
      utterance.onerror = () => setSpeakingMessageId((current) => (current === msg.id ? null : current));

      synth.speak(utterance);
    },
    [hasTTSSupport, speakingMessageId],
  );

  return { hasTTSSupport, speakingMessageId, toggleSpeak };
}
