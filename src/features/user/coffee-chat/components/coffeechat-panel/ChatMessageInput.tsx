import Image from 'next/image';

interface ChatMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function ChatMessageInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: ChatMessageInputProps) {
  const canSend = !!value.trim() && !disabled;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-2 px-4 py-3 border-t border-[#F3F4F6] shrink-0"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="메시지를 입력하세요"
        maxLength={2000}
        disabled={disabled}
        className="flex-1 h-11 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors disabled:opacity-60"
      />
      <button
        type="submit"
        aria-label="메시지 보내기"
        disabled={!canSend}
        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:cursor-not-allowed ${
          canSend ? 'bg-[#FF5E5E] hover:bg-[#D14848]' : 'bg-[#E5E7EB] hover:bg-[#E5E7EB]'
        }`}
      >
        <Image
          src={canSend ? '/chat/send-active.svg' : '/chat/send-inactive.svg'}
          alt="전송"
          width={18}
          height={18}
        />
      </button>
    </form>
  );
}
