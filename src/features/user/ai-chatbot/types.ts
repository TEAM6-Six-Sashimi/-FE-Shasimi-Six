export type ChatbotRole = 'user' | 'assistant';

export interface ChatbotHistoryItem {
  role: ChatbotRole;
  content: string;
}

// POST /api/chatbot/messages 응답
export interface ChatbotMessageResponse {
  reply: string;
}
