import { RefObject } from 'react';
import { ChatMessageEvent } from '../../types';

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
  messages: ChatMessageEvent[];
  myUserId: number;
  listEndRef: RefObject<HTMLDivElement | null>;
}

export default function ChatMessageList({ messages, myUserId, listEndRef }: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-1 bg-[#F9FAFB]">
      {messages.map((message, idx) => {
        const isMine = message.senderId === myUserId;
        const prevMessage = messages[idx - 1];
        const showDateDivider =
          !prevMessage ||
          formatDateDivider(prevMessage.createdAt) !== formatDateDivider(message.createdAt);

        return (
          <div key={message.messageId}>
            {showDateDivider && <DividerLine text={formatDateDivider(message.createdAt)} />}

            {message.messageType !== 'TEXT' ? (
              <DividerLine text={message.content} />
            ) : (
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
            )}
          </div>
        );
      })}
      <div ref={listEndRef} />
    </div>
  );
}
