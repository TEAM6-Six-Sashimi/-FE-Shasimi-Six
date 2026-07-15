'use client';

import { useState } from 'react';
import Image from 'next/image';
import CoffeeChatSidebar from './CoffeeChatSidebar';
import ChatPanel from './ChatPanel';
import { useCoffeeChatSocket } from '../hooks/useCoffeeChatSocket';
import { fetchChatMessagesAction } from '../actions';
import { UserMe } from '@/features/auth/types';
import { StudentChatRoom } from '../types';

interface CoffeeChatPageClientProps {
  role: UserMe['role'];
  userId: number;
  studentChatRooms: StudentChatRoom[];
}

export default function CoffeeChatPageClient({
  role,
  userId,
  studentChatRooms,
}: CoffeeChatPageClientProps) {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const { isConnected, subscribe, sendMessage } = useCoffeeChatSocket();

  const selectedRoom = studentChatRooms.find((room) => room.chatId === selectedChatId) ?? null;

  // 목록에서 채팅방을 고르는 시점에도 읽음 처리가 트리거되도록 메시지 조회를 한 번 미리 호출한다.
  // (ChatPanel이 마운트되면서 한 번 더 조회하지만, 백엔드가 두 시점 모두에 대응해달라고 해서 둘 다 호출)
  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    fetchChatMessagesAction(chatId);
  };

  return (
    <div className="flex bg-white h-[calc(100vh-140px)] min-h-[640px]">
      <div className="shrink-0 w-[500px]">
        <CoffeeChatSidebar
          role={role}
          studentChatRooms={studentChatRooms}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
        />
      </div>

      {selectedRoom ? (
        <ChatPanel
          room={selectedRoom}
          myUserId={userId}
          isConnected={isConnected}
          subscribe={subscribe}
          sendMessage={sendMessage}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-[#F9FAFB]">
          <Image src="/chat/chat-inactive.svg" alt="" width={50} height={50} />
          <p className="text-[14px] text-[#9CA3AF]">시작할 채팅을 선택해주세요.</p>
        </div>
      )}
    </div>
  );
}
