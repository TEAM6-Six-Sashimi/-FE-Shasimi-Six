'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import {
  acceptInstructorChatAction,
  fetchInstructorMessagesAction,
  leaveInstructorChatAction,
  rejectInstructorChatAction,
} from '../actions';
import { ChatMessage, InstructorChatRoom } from '../types';

const SEND_TIMEOUT_MS = 6000;

function formatDateDivider(iso: string) {
  return iso.slice(0, 10);
}

interface InstructorChatPanelProps {
  room: InstructorChatRoom;
  myUserId: number;
  isConnected: boolean;
  subscribe: (chatId: number, onMessage: (message: ChatMessage) => void) => () => void;
  sendMessage: (chatId: number, content: string) => boolean;
}

export default function InstructorChatPanel({
  room,
  myUserId,
  isConnected,
  subscribe,
  sendMessage,
}: InstructorChatPanelProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const isPending = room.status === 'PENDING';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  const pendingContentRef = useRef<string | null>(null);
  useEffect(() => {
    pendingContentRef.current = pendingContent;
  }, [pendingContent]);

  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    setPendingContent(null);

    fetchInstructorMessagesAction(room.chatId).then((history) => {
      if (cancelled) return;

      // 히스토리 응답이 오기 전에 소켓으로 먼저 도착한 실시간 메시지가 있을 수 있어서,
      // 그대로 덮어쓰지 않고 messageId 기준으로 병합한다 (안 그러면 그 메시지가 사라짐).
      setMessages((prev) => {
        const merged = [...history];
        for (const message of prev) {
          if (!merged.some((m) => m.messageId === message.messageId)) merged.push(message);
        }
        return merged.sort((a, b) => a.messageId - b.messageId);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [room.chatId]);

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe(room.chatId, (message) => {
      setMessages((prev) =>
        prev.some((m) => m.messageId === message.messageId) ? prev : [...prev, message],
      );

      if (message.senderId === myUserId && message.content === pendingContentRef.current) {
        setPendingContent(null);
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, room.chatId]);

  useEffect(() => {
    if (!pendingContent) return;

    const timer = setTimeout(() => {
      setPendingContent(null);
      showToast('메시지 전송에 실패했습니다. 다시 시도해주세요.', 'negative');
    }, SEND_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [pendingContent, showToast]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const handleSend = () => {
    const content = input.trim();
    if (!content || pendingContent) return;

    const sent = sendMessage(room.chatId, content);
    if (!sent) {
      showToast('연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.', 'negative');
      return;
    }

    setPendingContent(content);
    setInput('');
  };

  // 승인 성공 후 요청/채팅방 목록을 다시 GET해서 반영해야 함
  const handleAccept = async () => {
    if (isResponding) return;
    setIsResponding(true);
    const success = await acceptInstructorChatAction(room.chatId);
    setIsResponding(false);

    if (!success) {
      showToast('승인에 실패했습니다. 다시 시도해주세요.', 'negative');
      return;
    }

    router.refresh();
  };

  const handleReject = async () => {
    if (isResponding) return;
    setIsResponding(true);
    const success = await rejectInstructorChatAction(room.chatId);
    setIsResponding(false);

    if (!success) {
      showToast('거절에 실패했습니다. 다시 시도해주세요.', 'negative');
      return;
    }

    showToast('커피챗 요청이 거절되었습니다.', 'alarm');
    router.refresh();
  };

  const handleLeave = async () => {
    if (isResponding) return;
    setShowLeaveConfirm(false);
    setIsResponding(true);
    const success = await leaveInstructorChatAction(room.chatId);
    setIsResponding(false);

    if (!success) {
      showToast('나가기에 실패했습니다. 다시 시도해주세요.', 'negative');
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-[#E5E7EB]">
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

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1 bg-[#F9FAFB]">
        {messages.map((message, idx) => {
          const isMine = message.senderId === myUserId;
          const prevMessage = messages[idx - 1];
          const showDateDivider =
            !prevMessage ||
            formatDateDivider(prevMessage.createdAt) !== formatDateDivider(message.createdAt);

          return (
            <div key={message.messageId}>
              {showDateDivider && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span className="text-[12px] text-[#9CA3AF]">
                    {formatDateDivider(message.createdAt)}
                  </span>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                </div>
              )}

              <div className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className="flex items-end gap-1.5 max-w-[70%]">
                  {isMine && (
                    <span className="text-[11px] text-[#9CA3AF] shrink-0 whitespace-nowrap">
                      {message.isRead ? '읽음' : '읽지 않음'}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap wrap-break-word ${
                      isMine
                        ? 'bg-[#FFEBEB] text-[#1E2125]'
                        : 'bg-white border border-[#E5E7EB] text-[#1E2125]'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={listEndRef} />
      </div>

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 px-4 py-3 border-t border-[#F3F4F6] shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            maxLength={2000}
            disabled={!!pendingContent}
            className="flex-1 h-11 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#9CA3AF] outline-none focus:border-[#1E2125] transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            aria-label="메시지 보내기"
            disabled={!input.trim() || !!pendingContent}
            className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#D14848] transition-colors disabled:cursor-not-allowed ${
              input.trim() && !pendingContent ? 'bg-[#FF5E5E]' : 'bg-[#E5E7EB]'
            }`}
          >
            <Image
              src={
                input.trim() && !pendingContent
                  ? '/chat/send-active.svg'
                  : '/chat/send-inactive.svg'
              }
              alt="전송"
              width={18}
              height={18}
            />
          </button>
        </form>
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
