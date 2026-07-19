'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import CoffeeChatSidebar from './coffeechat-sidebar/CoffeeChatSidebar';
import ChatPanel from './coffeechat-panel/ChatPanel';
import InstructorChatPanel from './coffeechat-panel/InstructorChatPanel';
import { useCoffeeChatSocket } from '../hooks/useCoffeeChatSocket';
import { fetchChatMessagesAction, fetchInstructorMessagesAction } from '../actions';
import { UserMe } from '@/features/auth/types';
import { ChatMessageEvent, InstructorChatRoom, StudentChatRoom } from '../types';

interface CoffeeChatPageClientProps {
  role: UserMe['role'];
  userId: number;
  studentChatRooms: StudentChatRoom[];
  instructorPendingChats: InstructorChatRoom[];
  instructorActiveChats: InstructorChatRoom[];
}

interface UnreadTrackable {
  chatId: number;
  unreadMessageCount: number;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
}

// 새 메시지 도착 시 해당 방의 안읽음 개수/미리보기 갱신 (목록에 없는 chatId면 그대로 반환)
function applyIncomingMessage<T extends UnreadTrackable>(
  list: T[],
  chatId: number,
  message: ChatMessageEvent,
): T[] {
  return list.map((item) =>
    item.chatId === chatId
      ? {
          ...item,
          unreadMessageCount: item.unreadMessageCount + 1,
          lastMessagePreview: message.content,
          lastMessageAt: message.createdAt,
        }
      : item,
  );
}

// 방을 열람하면 그 방의 안읽음 개수를 0으로
function markRoomRead<T extends { chatId: number; unreadMessageCount: number }>(
  list: T[],
  chatId: number,
): T[] {
  return list.map((item) => (item.chatId === chatId ? { ...item, unreadMessageCount: 0 } : item));
}

export default function CoffeeChatPageClient({
  role,
  userId,
  studentChatRooms,
  instructorPendingChats,
  instructorActiveChats,
}: CoffeeChatPageClientProps) {
  const isInstructor = role === 'INSTRUCTOR';
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const { isConnected, subscribe, sendMessage } = useCoffeeChatSocket();

  // 안읽음 배지를 실시간으로 갱신하기 위해 서버 props를 그대로 렌더링하지 않고
  // 로컬 state로 승격한다. router.refresh() 등으로 서버 props가 새로 내려오면
  // (렌더링 도중 이전 prop과 비교해서) 로컬 state도 다시 동기화한다.
  const [rooms, setRooms] = useState(studentChatRooms);
  const [prevStudentChatRooms, setPrevStudentChatRooms] = useState(studentChatRooms);
  if (studentChatRooms !== prevStudentChatRooms) {
    setPrevStudentChatRooms(studentChatRooms);
    setRooms(studentChatRooms);
  }

  const [pendingChats, setPendingChats] = useState(instructorPendingChats);
  const [prevInstructorPendingChats, setPrevInstructorPendingChats] =
    useState(instructorPendingChats);
  if (instructorPendingChats !== prevInstructorPendingChats) {
    setPrevInstructorPendingChats(instructorPendingChats);
    setPendingChats(instructorPendingChats);
  }

  const [activeChats, setActiveChats] = useState(instructorActiveChats);
  const [prevInstructorActiveChats, setPrevInstructorActiveChats] =
    useState(instructorActiveChats);
  if (instructorActiveChats !== prevInstructorActiveChats) {
    setPrevInstructorActiveChats(instructorActiveChats);
    setActiveChats(instructorActiveChats);
  }

  const selectedStudentRoom = !isInstructor
    ? (rooms.find((room) => room.chatId === selectedChatId) ?? null)
    : null;
  const selectedInstructorChat = isInstructor
    ? (pendingChats.find((chat) => chat.chatId === selectedChatId) ??
      activeChats.find((chat) => chat.chatId === selectedChatId) ??
      null)
    : null;

  // 지금 열어본 방을 제외한 나머지 모든 방에 구독을 걸어서, 안 열어본(배경) 방에
  // 새 메시지가 오면 목록의 안읽음 배지를 실시간으로 갱신한다.
  // 열어본 방은 각 채팅 패널이 자체적으로 구독하므로 여기서는 제외한다(중복 구독 방지).
  const roomIdsKey = rooms.map((room) => room.chatId).join(',');
  const pendingIdsKey = pendingChats.map((chat) => chat.chatId).join(',');
  const activeIdsKey = activeChats.map((chat) => chat.chatId).join(',');

  useEffect(() => {
    if (!isConnected) return;

    const parseIds = (key: string) => (key ? key.split(',').map(Number) : []);
    const allIds = isInstructor
      ? [...new Set([...parseIds(pendingIdsKey), ...parseIds(activeIdsKey)])]
      : [...new Set(parseIds(roomIdsKey))];
    const backgroundChatIds = allIds.filter((chatId) => chatId !== selectedChatId);

    const unsubscribers = backgroundChatIds.map((chatId) =>
      subscribe(chatId, (message) => {
        if (message.eventType === 'READ') return; // 읽음 이벤트는 안읽음 배지에 영향 없음
        if (message.senderId === userId) return; // 내가 보낸 메시지는 안읽음으로 세지 않는다

        if (isInstructor) {
          setPendingChats((prev) => applyIncomingMessage(prev, chatId, message));
          setActiveChats((prev) => applyIncomingMessage(prev, chatId, message));
        } else {
          setRooms((prev) => applyIncomingMessage(prev, chatId, message));
        }
      }),
    );

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, isInstructor, selectedChatId, roomIdsKey, pendingIdsKey, activeIdsKey]);

  // 목록에서 채팅방을 고르는 시점에도 읽음 처리가 트리거되도록 메시지 조회를 한 번 미리 호출한다.
  // (각 채팅 패널이 마운트되면서 한 번 더 조회하지만, 백엔드가 두 시점 모두에 대응해달라고 해서 둘 다 호출)
  // 안읽음 배지는 서버 응답을 기다리지 않고 선택 즉시 0으로 반영한다.
  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);

    if (isInstructor) {
      setPendingChats((prev) => markRoomRead(prev, chatId));
      setActiveChats((prev) => markRoomRead(prev, chatId));
      fetchInstructorMessagesAction(chatId);
    } else {
      setRooms((prev) => markRoomRead(prev, chatId));
      fetchChatMessagesAction(chatId);
    }
  };

  const hasSelection = !!selectedStudentRoom || !!selectedInstructorChat;

  return (
    <div className="flex flex-col lg:flex-row bg-white h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] min-h-[500px] lg:min-h-[670px]">
      <div
        className={`w-full lg:w-[420px] xl:w-[500px] shrink-0 flex-1 lg:flex-none ${
          hasSelection ? 'hidden lg:block' : ''
        }`}
      >
        <CoffeeChatSidebar
          role={role}
          studentChatRooms={rooms}
          instructorPendingChats={pendingChats}
          instructorActiveChats={activeChats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onTabChange={() => setSelectedChatId(null)}
        />
      </div>

      {selectedStudentRoom && (
        <ChatPanel
          key={selectedStudentRoom.chatId}
          room={selectedStudentRoom}
          myUserId={userId}
          isConnected={isConnected}
          subscribe={subscribe}
          sendMessage={sendMessage}
          onBack={() => setSelectedChatId(null)}
        />
      )}
      {selectedInstructorChat && (
        <InstructorChatPanel
          key={selectedInstructorChat.chatId}
          room={selectedInstructorChat}
          myUserId={userId}
          isConnected={isConnected}
          subscribe={subscribe}
          sendMessage={sendMessage}
          onBack={() => setSelectedChatId(null)}
        />
      )}
      {!hasSelection && (
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center gap-2 bg-[#F9FAFB]">
          <Image src="/chat/chat-inactive.svg" alt="" width={50} height={50} />
          <p className="text-[14px] text-[#9CA3AF]">시작할 채팅을 선택해주세요.</p>
        </div>
      )}
    </div>
  );
}
