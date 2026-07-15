import { StudentChatRoom } from '../types';

const AVATAR_GRADIENTS = [
  ['#FBCFE8', '#7DD3FC'],
  ['#BFDBFE', '#3B5B92'],
  ['#D9F2D0', '#86C97C'],
  ['#D9F2D0', '#5FA854'],
  ['#FDE9C8', '#3B5B92'],
];

function avatarGradient(seed: number) {
  const [from, to] = AVATAR_GRADIENTS[seed % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${from} 50%, ${to} 50%)`;
}

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
      {rooms.map((room) => (
        <li key={room.chatId} className="border-b border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => onSelect(room.chatId)}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F9FAFB] transition-colors cursor-pointer ${
              selectedChatId === room.chatId ? 'bg-[#F9FAFB]' : ''
            }`}
          >
            <div
              className="w-11 h-11 rounded-full shrink-0"
              style={{ background: avatarGradient(room.instructorId) }}
            />

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
              {room.hasUnreadMessages && (
                <span className="w-4.5 h-4.5 rounded-full bg-[#FF5E5E]" />
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
