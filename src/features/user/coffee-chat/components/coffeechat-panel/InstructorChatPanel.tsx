'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import {
  acceptInstructorChatAction,
  fetchInstructorMessagesAction,
  leaveInstructorChatAction,
  rejectInstructorChatAction,
} from '../../actions';
import { useChatMessages } from '../../hooks/useChatMessages';
import { ChatMessage, ChatMessageEvent, InstructorChatRoom } from '../../types';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';

interface InstructorChatPanelProps {
  room: InstructorChatRoom;
  myUserId: number;
  isConnected: boolean;
  subscribe: (chatId: number, onMessage: (message: ChatMessage) => void) => () => void;
  sendMessage: (chatId: number, content: string) => boolean;
  onBack: () => void;
  // 사이드바 목록의 최근 메시지 미리보기를 실시간으로 갱신하기 위한 콜백
  onMessage?: (message: ChatMessageEvent) => void;
}

export default function InstructorChatPanel({
  room,
  myUserId,
  isConnected,
  subscribe,
  sendMessage,
  onBack,
  onMessage,
}: InstructorChatPanelProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const isPending = room.status === 'PENDING';
  const [isResponding, setIsResponding] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const { messages, input, setInput, pendingContent, listEndRef, handleSend } = useChatMessages({
    chatId: room.chatId,
    myUserId,
    fetchMessages: fetchInstructorMessagesAction,
    isConnected,
    subscribe,
    sendMessage,
    onMessage,
  });

  // 승인 성공 후 요청/채팅방 목록을 다시 GET해서 반영해야 함.
  // router.refresh()는 완료를 기다릴 수 있는 Promise가 아니라 재요청만 트리거하고 바로
  // 반환되므로, 성공 시엔 여기서 isResponding을 풀지 않는다. 그렇게 안 하면 실제 방 상태
  // (PENDING→ACCEPTED 등)가 화면에 반영되기 전에 버튼이 다시 눌릴 수 있는 창이 생겨서
  // 같은 액션이 중복으로 나갈 수 있다 — 이 방은 성공 시 상태가 바뀌면서 버튼 자체가
  // 사라지거나(수락) 목록에서 빠져서 패널이 언마운트되므로(거절/나가기), 실패/예외 시에만
  // 재시도할 수 있도록 풀어주면 된다.
  const handleAccept = async () => {
    if (isResponding) return;
    setIsResponding(true);
    try {
      const success = await acceptInstructorChatAction(room.chatId);
      if (!success) {
        showToast('승인에 실패했습니다. 다시 시도해주세요.', 'negative');
        setIsResponding(false);
        return;
      }
      router.refresh();
    } catch {
      setIsResponding(false);
      showToast('승인에 실패했습니다. 다시 시도해주세요.', 'negative');
    }
  };

  const handleReject = async () => {
    if (isResponding) return;
    setIsResponding(true);
    try {
      const success = await rejectInstructorChatAction(room.chatId);
      if (!success) {
        showToast('거절에 실패했습니다. 다시 시도해주세요.', 'negative');
        setIsResponding(false);
        return;
      }
      showToast('커피챗 요청이 거절되었습니다.', 'alarm');
      router.refresh();
    } catch {
      setIsResponding(false);
      showToast('거절에 실패했습니다. 다시 시도해주세요.', 'negative');
    }
  };

  const handleLeave = async () => {
    if (isResponding) return;
    setShowLeaveConfirm(false);
    setIsResponding(true);
    try {
      const success = await leaveInstructorChatAction(room.chatId);
      if (!success) {
        showToast('나가기에 실패했습니다. 다시 시도해주세요.', 'negative');
        setIsResponding(false);
        return;
      }
      router.refresh();
    } catch {
      setIsResponding(false);
      showToast('나가기에 실패했습니다. 다시 시도해주세요.', 'negative');
    }
  };

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
        <div className="w-9 h-9 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center">
          <Image src="/chat/basic-profile-gray.svg" alt="" width={18} height={18} />
        </div>
        <h2 className="text-[15px] font-bold text-[#1E2125] flex-1">
          {room.studentLoginId} - {room.courseTitle}
        </h2>
        {!isPending && (
          <button
            type="button"
            onClick={() => setShowLeaveConfirm(true)}
            disabled={isResponding}
            className="h-9 px-4 rounded-md bg-[#FF5E5E] text-white text-[13px] font-semibold shrink-0 cursor-pointer hover:bg-[#D14848] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            나가기
          </button>
        )}
      </div>

      <ChatMessageList messages={messages} myUserId={myUserId} listEndRef={listEndRef} />

      {isPending ? (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[#F3F4F6] shrink-0">
          <div className="flex-1 h-11 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] flex items-center text-[13.5px] text-[#9CA3AF]">
            채팅을 수락하면 답변할 수 있습니다.
          </div>
          <button
            type="button"
            onClick={handleAccept}
            disabled={isResponding}
            className="h-11 px-5 rounded-lg border border-[#827717] bg-[#F9FBE7] text-[#827717] text-[14px] font-semibold shrink-0 cursor-pointer hover:bg-[#E6EAC9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            수락
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={isResponding}
            className="h-11 px-5 rounded-lg bg-[#FF5E5E] text-white text-[14px] font-semibold shrink-0 cursor-pointer hover:bg-[#D14848] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            거절
          </button>
        </div>
      ) : (
        <ChatMessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          disabled={!!pendingContent}
        />
      )}

      {showLeaveConfirm && (
        <TwoButtonModal
          title="채팅방 나가기"
          message="채팅방을 떠나시겠습니까?"
          confirmLabel={isResponding ? '처리 중...' : '확인'}
          cancelLabel="취소"
          onConfirm={handleLeave}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}
    </div>
  );
}
