'use server';

import { cookies } from 'next/headers';
import {
  fetchChatMessages,
  fetchInstructorPendingChats,
  fetchStudentChatRooms,
} from '@/services/coffee-chat.service';
import { ChatMessage, InstructorPendingChat, StudentChatRoom } from './types';

export async function fetchStudentChatRoomsAction(): Promise<StudentChatRoom[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchStudentChatRooms(accessToken);
}

export async function fetchInstructorPendingChatsAction(): Promise<InstructorPendingChat[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchInstructorPendingChats(accessToken);
}

export async function fetchChatMessagesAction(chatId: number): Promise<ChatMessage[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchChatMessages(accessToken, chatId);
}
