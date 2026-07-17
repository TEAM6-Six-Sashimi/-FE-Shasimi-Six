import InlineDotsLoading from '@/components/ui/InlineDotsLoading';
import BotAvatar from './BotAvatar';

// 답변을 기다리는 동안 말풍선 자리에 보여줄 로딩 인디케이터
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
