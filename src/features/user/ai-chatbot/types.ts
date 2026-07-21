export type ChatbotRole = 'user' | 'assistant';

export interface ChatbotHistoryItem {
  role: ChatbotRole;
  content: string;
}

// POST /api/chatbot/messages
export interface ChatbotMessageResponse {
  reply: string;
}

export interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
  isIntro?: boolean;
}
