import Image from 'next/image';
import { ChatMessage } from '../types';
import BotAvatar from './BotAvatar';

// **로 감싼 부분만 굵게 렌더링 (초기 안내 메시지의 강조 표시용)
function renderMessageText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

interface Props {
  msg: ChatMessage;
  isStreaming: boolean;
  hasTTSSupport: boolean;
  isSpeaking: boolean;
  onToggleSpeak: (msg: ChatMessage) => void;
}

export default function MessageBubble({
  msg,
  isStreaming,
  hasTTSSupport,
  isSpeaking,
  onToggleSpeak,
}: Props) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-70 bg-[#5B8DEE] text-white text-[13.5px] leading-relaxed rounded-2xl rounded-br-sm px-4 py-2.5 whitespace-pre-line wrap-break-word">
          {msg.text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <p className="max-w-68 bg-[#F3F4F6] text-[#1E2125] text-[13px] border leading-relaxed rounded-2xl rounded-bl-sm px-4 py-2.5 whitespace-pre-line wrap-break-word">
        {renderMessageText(msg.text)}
        {isStreaming && (
          <span className="inline-block w-1 h-3.5 bg-[#9CA3AF] ml-0.5 align-middle animate-pulse" />
        )}
      </p>
      {hasTTSSupport && msg.text && !isStreaming && (
        <button
          type="button"
          aria-label={isSpeaking ? '읽기 중지' : '텍스트 읽어주기'}
          onClick={() => onToggleSpeak(msg)}
          className="shrink-0 cursor-pointer"
        >
          <Image
            src={isSpeaking ? '/chat/speaker-stop.svg' : '/chat/speaker-active.svg'}
            alt=""
            width={13}
            height={13}
          />
        </button>
      )}
    </div>
  );
}
