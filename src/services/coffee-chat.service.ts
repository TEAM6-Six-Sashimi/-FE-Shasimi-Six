import { ChatMessage, StudentChatRoom } from '@/features/user/coffee-chat/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 학생 - 내 채팅방 목록 조회
export async function fetchStudentChatRooms(accessToken: string): Promise<StudentChatRoom[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/student/coffee-chats`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}

// 채팅방 메시지 히스토리 조회 (학생 기준)
export async function fetchChatMessages(
  accessToken: string,
  chatId: number,
): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/student/coffee-chats/${chatId}/messages`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}
