'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import Image from 'next/image';

// 입력창 최소/최대 높이 - 한 줄일 땐 전송 버튼과 높이를 맞추고, 두 줄 분량부터는 그 이상 늘어나지 않고 내부 스크롤
export const TEXTAREA_MIN_HEIGHT = 40;
export const TEXTAREA_MAX_HEIGHT = 61;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

const ChatInput = forwardRef<HTMLTextAreaElement, Props>(function ChatInput(
  { value, onChange, onSend, disabled },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  // 기본 한 줄 높이(전송 버튼과 동일)에서 시작해 두 줄 분량까지 자동으로 늘어나고, 그 이상은 내부 스크롤
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const needsScroll = el.scrollHeight > TEXTAREA_MAX_HEIGHT;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, TEXTAREA_MIN_HEIGHT), TEXTAREA_MAX_HEIGHT)}px`;
    el.style.overflowY = needsScroll ? 'auto' : 'hidden';
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 등 IME 조합 중 Enter로 조합을 확정하는 경우까지 전송으로 처리되지 않도록 방지
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = !!value.trim() && !disabled;

  return (
    <div className="flex items-end gap-2 px-4 py-3 border-t border-[#F3F4F6] shrink-0">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="진로 고민을 편하게 입력해보세요"
        maxLength={2000}
        rows={1}
        className="flex-1 resize-none overflow-hidden py-2 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors"
      />
      <button
        type="button"
        aria-label="메시지 보내기"
        onClick={onSend}
        disabled={!canSend}
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:cursor-not-allowed ${
          canSend ? 'bg-[#5B8DEE]' : 'bg-[#E5E7EB]'
        }`}
      >
        <Image
          src={canSend ? '/chat/send-active.svg' : '/chat/send-inactive.svg'}
          alt="전송"
          width={18}
          height={18}
        />
      </button>
    </div>
  );
});

export default ChatInput;
