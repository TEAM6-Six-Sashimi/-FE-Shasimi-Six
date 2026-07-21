import InlineDotsLoading from '@/components/ui/InlineDotsLoading';
import BotAvatar from './BotAvatar';

// 응답 대기 로딩 인디케이터
export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <div className="bg-[#F3F4F6] border rounded-2xl rounded-bl-sm px-4 py-2">
        <InlineDotsLoading />
      </div>
    </div>
  );
}
