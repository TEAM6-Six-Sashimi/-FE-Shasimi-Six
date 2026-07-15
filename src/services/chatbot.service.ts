import { ChatbotHistoryItem, ChatbotMessageResponse } from '@/features/user/main/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type SendChatbotMessageResult =
  | { success: true; reply: string }
  | { success: false; message: string };

// AI 진로상담 챗봇 대화 (공개, 비로그인 허용 / 무상태 - 서버는 대화를 저장하지 않음)
export async function sendChatbotMessage(
  message: string,
  history: ChatbotHistoryItem[],
): Promise<SendChatbotMessageResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chatbot/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
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
