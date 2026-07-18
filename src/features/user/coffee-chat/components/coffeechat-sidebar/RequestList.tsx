import Image from 'next/image';
import { InstructorChatRoom } from '../../types';

function formatDate(iso: string | null) {
  return iso ? iso.slice(0, 10) : '';
}

interface RequestListProps {
  requests: InstructorChatRoom[];
  selectedChatId: number | null;
  onSelect: (chatId: number) => void;
}

export default function RequestList({ requests, selectedChatId, onSelect }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[13px] text-[#9CA3AF]">아직 채팅방이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex-1 overflow-y-auto">
      {requests.map((request) => (
        <li key={request.chatId} className="border-b border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => onSelect(request.chatId)}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors cursor-pointer ${
              selectedChatId === request.chatId ? 'bg-[#FFEBEB]' : 'hover:bg-[#F9FAFB]'
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center">
              <Image src="/chat/basic-profile-gray.svg" alt="" width={22} height={22} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#1E2125] truncate">
                {request.studentLoginId} - {request.courseTitle}
              </p>
              <p className="text-[12.5px] text-[#9CA3AF] truncate">
                {request.lastMessagePreview ?? '아직 나눈 대화가 없습니다.'}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[11.5px] text-[#9CA3AF]">
                {formatDate(request.lastMessageAt)}
              </span>
              {request.unreadMessageCount > 0 && (
                <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-[#FF5E5E] flex items-center justify-center text-[10px] leading-none text-white font-semibold">
                  {request.unreadMessageCount}
                </span>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
