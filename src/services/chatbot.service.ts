import { ChatbotHistoryItem, ChatbotMessageResponse } from '@/features/user/ai-chatbot/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 백엔드가 재배포 등으로 응답을 못 주는 경우 무한 대기하지 않도록 타임아웃(60초)
const CHATBOT_TIMEOUT_MS = 60000;

export type SendChatbotMessageResult =
  | { success: true; reply: string }
  | { success: false; message: string };

// AI 진로상담 챗봇 대화
export async function sendChatbotMessage(
  message: string,
  history: ChatbotHistoryItem[],
): Promise<SendChatbotMessageResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chatbot/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal: AbortSignal.timeout(CHATBOT_TIMEOUT_MS),
    });

    if (!res.ok) {
      return { success: false, message: '메시지를 보내지 못했습니다. 잠시 후 다시 시도해주세요.' };
    }

    const data: ChatbotMessageResponse = await res.json();
    return { success: true, reply: data.reply };
  } catch (e) {
    console.error('[sendChatbotMessage] fetch error:', e);
    return { success: false, message: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
  }
}
