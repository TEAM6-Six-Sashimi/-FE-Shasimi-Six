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

// 강사 - 커피챗 조회 응답
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

// 실제 메시지
// 시스템 메시지(승인/거절/나가기)는 messageType으로 구분
export interface ChatMessageEvent {
  eventType: 'MESSAGE';
  messageId: number;
  senderId: number;
  content: string;
  messageType: ChatMessageType;
  isRead: boolean;
  createdAt: string;
}

// 읽음 이벤트
export interface ChatReadEvent {
  eventType: 'READ';
  lastReadMessageId: number;
}

export type ChatMessage = ChatMessageEvent | ChatReadEvent;
