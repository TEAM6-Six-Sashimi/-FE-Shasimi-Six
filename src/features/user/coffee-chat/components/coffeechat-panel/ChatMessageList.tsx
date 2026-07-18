import { RefObject } from 'react';
import { ChatMessage } from '../../types';

function formatDateDivider(iso: string) {
  return iso.slice(0, 10);
}

function DividerLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[#E5E7EB]" />
      <span className="text-[12px] text-[#9CA3AF]">{text}</span>
      <div className="flex-1 h-px bg-[#E5E7EB]" />
    </div>
  );
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  myUserId: number;
  listEndRef: RefObject<HTMLDivElement | null>;
  // 거절/나가기 안내 문구. 지정한 인덱스의 메시지 바로 다음에 고정으로 삽입된다
  // (-1이면 메시지 목록 맨 앞).
  notice?: string | null;
  noticeAfterIndex?: number;
}

export default function ChatMessageList({
  messages,
  myUserId,
  listEndRef,
  notice = null,
  noticeAfterIndex = -1,
}: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1 bg-[#F9FAFB]">
      {notice && noticeAfterIndex === -1 && <DividerLine text={notice} />}
      {messages.map((message, idx) => {
        const isMine = message.senderId === myUserId;
        const prevMessage = messages[idx - 1];
        const showDateDivider =
          !prevMessage ||
          formatDateDivider(prevMessage.createdAt) !== formatDateDivider(message.createdAt);

        return (
          <div key={message.messageId}>
            {showDateDivider && <DividerLine text={formatDateDivider(message.createdAt)} />}

            <div className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-end gap-1.5 max-w-[70%]">
                {isMine && (
                  <span className="text-[11px] text-[#9CA3AF] shrink-0 whitespace-nowrap">
                    {message.isRead ? '읽음' : '읽지 않음'}
                  </span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed whitespace-pre-wrap wrap-break-words ${
                    isMine
                      ? 'bg-[#FFEBEB] text-[#1E2125]'
                      : 'bg-white border border-[#E5E7EB] text-[#1E2125]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>

            {notice && idx === noticeAfterIndex && <DividerLine text={notice} />}
          </div>
        );
      })}
      <div ref={listEndRef} />
    </div>
  );
}
