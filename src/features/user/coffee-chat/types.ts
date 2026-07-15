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
  hasUnreadMessages: boolean;
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
