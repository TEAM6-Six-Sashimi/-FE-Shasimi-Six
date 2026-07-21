'use client';

import Image from 'next/image';
import { getThumbnailUrl } from '@/lib/thumbnail';
import { fetchChatMessagesAction } from '../../actions';
import { useChatMessages } from '../../hooks/useChatMessages';
import { ChatMessage, ChatMessageEvent, StudentChatRoom } from '../../types';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';

interface ChatPanelProps {
  room: StudentChatRoom;
  myUserId: number;
  isConnected: boolean;
  subscribe: (chatId: number, onMessage: (message: ChatMessage) => void) => () => void;
  sendMessage: (chatId: number, content: string) => boolean;
  onBack: () => void;
  // 사이드바 목록의 최근 메시지 미리보기 실시간 갱신을 위한 콜백
  onMessage?: (message: ChatMessageEvent) => void;
}

export default function ChatPanel({
  room,
  myUserId,
  isConnected,
  subscribe,
  sendMessage,
  onBack,
  onMessage,
}: ChatPanelProps) {
  const profileImageUrl = getThumbnailUrl(room.profileImagePath);

  const { messages, input, setInput, pendingContent, listEndRef, handleSend } = useChatMessages({
    chatId: room.chatId,
    myUserId,
    fetchMessages: fetchChatMessagesAction,
    isConnected,
    subscribe,
    sendMessage,
    onMessage,
  });

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-[#E5E7EB]">
        <button
          type="button"
          onClick={onBack}
          aria-label="목록으로 돌아가기"
          className="w-8 h-8 -ml-2 flex items-center justify-center rounded-md shrink-0 cursor-pointer hover:bg-[#F3F4F6] transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#1E2125]"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-[#E5E7EB] shrink-0 overflow-hidden flex items-center justify-center relative">
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={`${room.instructorName} 프로필 사진`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <Image src="/chat/basic-profile-gray.svg" alt="" width={18} height={18} />
          )}
        </div>
        <h2 className="text-[15px] font-bold text-[#1E2125]">
          {room.instructorName} 강사 - {room.courseTitle}
        </h2>
      </div>

      <ChatMessageList messages={messages} myUserId={myUserId} listEndRef={listEndRef} />

      <ChatMessageInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        disabled={!!pendingContent}
      />
    </div>
  );
}
