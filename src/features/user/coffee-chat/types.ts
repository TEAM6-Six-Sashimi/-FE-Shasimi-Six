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

export interface ChatMessage {
  messageId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}
