'use server';

import { sendChatbotMessage, SendChatbotMessageResult } from '@/services/chatbot.service';
import { ChatbotHistoryItem } from './types';

export async function sendChatbotMessageAction(
  message: string,
  history: ChatbotHistoryItem[],
): Promise<SendChatbotMessageResult> {
  return sendChatbotMessage(message, history);
}
