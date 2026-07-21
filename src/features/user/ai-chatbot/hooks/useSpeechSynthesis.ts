import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types';
import { stripMarkdown } from '@/lib/utils';

// 스피커 아이콘 - TTS(SpeechSynthesis)
export function useSpeechSynthesis() {
  const [hasTTSSupport, setHasTTSSupport] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

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
      // 한국어 음성을 찾아 지정
      const koreanVoice = voicesRef.current.find((voice) =>
        voice.lang.toLowerCase().startsWith('ko'),
      );
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }
      utterance.onstart = () => setSpeakingMessageId(msg.id);
      utterance.onend = () =>
        setSpeakingMessageId((current) => (current === msg.id ? null : current));
      utterance.onerror = () =>
        setSpeakingMessageId((current) => (current === msg.id ? null : current));

      synth.speak(utterance);
    },
    [hasTTSSupport, speakingMessageId],
  );

  return { hasTTSSupport, speakingMessageId, toggleSpeak };
}
