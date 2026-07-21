import Image from 'next/image';
import { getThumbnailUrl } from '@/lib/thumbnail';
import { StudentChatRoom } from '../../types';

function formatDate(iso: string | null) {
  return iso ? iso.slice(0, 10) : '';
}

interface ChatRoomListProps {
  rooms: StudentChatRoom[];
  selectedChatId: number | null;
  onSelect: (chatId: number) => void;
}

export default function ChatRoomList({ rooms, selectedChatId, onSelect }: ChatRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[13px] text-[#9CA3AF]">아직 채팅방이 없습니다.</p>
      </div>
    );
  }

  return (
    <ul className="flex-1 overflow-y-auto">
      {rooms.map((room) => {
        const profileImageUrl = getThumbnailUrl(room.profileImagePath);

        return (
          <li key={room.chatId} className="border-b border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => onSelect(room.chatId)}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors cursor-pointer ${
                selectedChatId === room.chatId ? 'bg-[#FFEBEB]' : 'hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-[#D1D5DB] shrink-0 overflow-hidden flex items-center justify-center relative">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={`${room.instructorName} 프로필 사진`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <Image src="/chat/basic-profile-gray.svg" alt="" width={22} height={22} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#1E2125] truncate">
                  {room.instructorName} 강사 - {room.courseTitle}
                </p>
                <p className="text-[12.5px] text-[#9CA3AF] truncate">
                  {room.lastMessagePreview ?? '아직 나눈 대화가 없습니다.'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11.5px] text-[#9CA3AF]">
                  {formatDate(room.lastMessageAt)}
                </span>
                {room.unreadMessageCount > 0 && (
                  <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-[#FF5E5E] flex items-center justify-center text-[10px] leading-none text-white font-semibold">
                    {room.unreadMessageCount}
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
