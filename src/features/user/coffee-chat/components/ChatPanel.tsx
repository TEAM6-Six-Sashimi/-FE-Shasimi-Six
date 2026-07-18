'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/ToastContext';
import { fetchChatMessagesAction } from '../actions';
import { ChatMessage, StudentChatRoom } from '../types';
import Image from 'next/image';
import { getThumbnailUrl } from '@/lib/thumbnail';

// 채팅방의 첫 메시지는 강사 요청 목록 반영 등 서버 쪽 추가 처리가 붙어서
// 이후 메시지보다 왕복이 더 걸리는 경우가 있어, 여유를 두고 6초로 잡는다.
const SEND_TIMEOUT_MS = 6000;

function formatDateDivider(iso: string) {
  return iso.slice(0, 10);
}

interface ChatPanelProps {
  room: StudentChatRoom;
  myUserId: number;
  isConnected: boolean;
  subscribe: (chatId: number, onMessage: (message: ChatMessage) => void) => () => void;
  sendMessage: (chatId: number, content: string) => boolean;
}

export default function ChatPanel({
  room,
  myUserId,
  isConnected,
  subscribe,
  sendMessage,
}: ChatPanelProps) {
  const { showToast } = useToast();
  const profileImageUrl = getThumbnailUrl(room.profileImagePath);
  const statusNotice =
    room.status === 'REJECTED'
      ? '커피챗 요청이 강사에 의해 거절되었습니다. 다시 메시지를 보내시면 재요청이 가능합니다.'
      : room.status === 'LEFT'
        ? `${room.instructorName} 강사가 채팅방을 떠났습니다. 다시 메시지를 보내시면 재요청이 가능합니다.`
        : null;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 방 진입 시점까지의 히스토리 개수. 거절/나가기 안내 문구는 이 지점 뒤에 고정하고,
  // 그 이후 실시간으로 도착한 메시지(재요청)는 안내 문구 아래에 쌓이도록 한다.
  const [historyCount, setHistoryCount] = useState(0);
  const [input, setInput] = useState('');
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  // subscribe 이펙트의 onMessage 클로저가 매 렌더마다 재생성되지 않아서
  // pendingContent state를 직접 참조하면 오래된 값을 보게 된다 (stale closure).
  // 항상 최신 값을 읽기 위해 ref로 따로 추적한다.
  const pendingContentRef = useRef<string | null>(null);
  useEffect(() => {
    pendingContentRef.current = pendingContent;
  }, [pendingContent]);

  // 방 진입 시 히스토리 로드
  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    setHistoryCount(0);
    setPendingContent(null);

    fetchChatMessagesAction(room.chatId).then((history) => {
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
      setHistoryCount(history.length);
    });

    return () => {
      cancelled = true;
    };
  }, [room.chatId]);

  // 연결되면 실시간 구독
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

  // 전송 타임아웃 처리
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

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-[#E5E7EB]">
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
            <div className="absolute inset-0 flex items-center justify-center text-[#6A7282] text-[7px] text-center px-0.5 leading-tight">
              프로필 사진 없음
            </div>
          )}
        </div>
        <h2 className="text-[15px] font-bold text-[#1E2125]">
          {room.instructorName} 강사 - {room.courseTitle}
        </h2>
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

              {statusNotice && idx === historyCount - 1 && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span className="text-[12px] text-[#9CA3AF]">{statusNotice}</span>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                </div>
              )}
            </div>
          );
        })}
        {statusNotice && historyCount === 0 && (
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-[12px] text-[#9CA3AF]">{statusNotice}</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>
        )}
        <div ref={listEndRef} />
      </div>

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
          className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:cursor-not-allowed ${
            input.trim() && !pendingContent ? 'bg-[#FF5E5E]' : 'bg-[#E5E7EB]'
          }`}
        >
          <Image
            src={input.trim() && !pendingContent ? '/chat/send-active.svg' : '/chat/send-inactive.svg'}
            alt="전송"
            width={18}
            height={18}
          />
        </button>
      </form>
    </div>
  );
}
