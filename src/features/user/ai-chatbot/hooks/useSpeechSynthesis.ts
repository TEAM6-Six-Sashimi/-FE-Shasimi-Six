import { useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { stripMarkdown } from '@/lib/utils';

// 스피커 아이콘으로 메시지를 TTS(SpeechSynthesis)로 읽어주고, 읽는 중인 메시지를 다시 누르면 중지
export function useSpeechSynthesis() {
  const [hasTTSSupport, setHasTTSSupport] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

  // 브라우저의 TTS(SpeechSynthesis) 지원 여부 체크
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof window.speechSynthesis !== 'undefined') {
      setHasTTSSupport(true);
    }
  }, []);

  // 채팅창을 닫거나 컴포넌트가 사라지면 읽던 음성도 함께 중단
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleSpeak = (msg: ChatMessage) => {
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
    const koreanVoice = synth.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }
    utterance.onstart = () => setSpeakingMessageId(msg.id);
    utterance.onend = () => setSpeakingMessageId((current) => (current === msg.id ? null : current));
    utterance.onerror = () => setSpeakingMessageId((current) => (current === msg.id ? null : current));

    synth.speak(utterance);
  };

  return { hasTTSSupport, speakingMessageId, toggleSpeak };
}
