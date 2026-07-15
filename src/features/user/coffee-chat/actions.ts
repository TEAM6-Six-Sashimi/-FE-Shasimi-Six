'use server';

import { cookies } from 'next/headers';
import { fetchChatMessages, fetchStudentChatRooms } from '@/services/coffee-chat.service';
import { ChatMessage, StudentChatRoom } from './types';

export async function fetchStudentChatRoomsAction(): Promise<StudentChatRoom[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchStudentChatRooms(accessToken);
}

export async function fetchChatMessagesAction(chatId: number): Promise<ChatMessage[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchChatMessages(accessToken, chatId);
}
