export type CoffeeChatStatus = 'PENDING' | 'ACCEPTED' | 'LEFT' | 'REJECTED';

export interface StudentChatRoom {
  chatId: number;
  instructorId: number;
  instructorName: string;
  courseId: number;
  courseTitle: string;
  status: CoffeeChatStatus;
  createdAt: string;
  acceptedAt: string | null;
  unreadMessageCount: number;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  profileImagePath: string | null;
}

// 강사 - 커피챗 조회 응답 (요청 목록 / 채팅방 목록 공통 형태)
export interface InstructorChatRoom {
  chatId: number;
  studentId: number;
  studentLoginId: string;
  courseId: number;
  courseTitle: string;
  status: CoffeeChatStatus;
  createdAt: string;
  acceptedAt: string | null;
  unreadMessageCount: number;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
}

export type ChatMessageType = 'TEXT' | 'SYSTEM_ACCEPT' | 'SYSTEM_REJECT' | 'SYSTEM_LEAVE';

// 실제 메시지(REST/웹소켓 공통) - 시스템 메시지(승인/거절/나가기)도 이 타입으로 오되
// messageType으로 구분되고, senderId/content는 행동한 강사 id/기본 문구로 채워져서 온다.
export interface ChatMessageEvent {
  eventType: 'MESSAGE';
  messageId: number;
  senderId: number;
  content: string;
  messageType: ChatMessageType;
  isRead: boolean;
  createdAt: string;
}

// 읽음 이벤트 - 웹소켓으로만 오고 REST 응답엔 없음. lastReadMessageId 이하 메시지가
// (내가 보낸 것 기준으로) 전부 읽음 처리됐다는 뜻.
export interface ChatReadEvent {
  eventType: 'READ';
  lastReadMessageId: number;
}

export type ChatMessage = ChatMessageEvent | ChatReadEvent;
