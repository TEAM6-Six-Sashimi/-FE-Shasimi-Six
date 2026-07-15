export interface Course {
  courseId: number;
  instructorName: string;
  title: string;
  price: number;
  thumbnail: string;
  totalDuration: number;
  ratingAvg: number;
  studentCount: number;
  category?: string;
}

export type ChatbotRole = 'user' | 'assistant';

export interface ChatbotHistoryItem {
  role: ChatbotRole;
  content: string;
}

// POST /api/chatbot/messages 응답
export interface ChatbotMessageResponse {
  reply: string;
}
