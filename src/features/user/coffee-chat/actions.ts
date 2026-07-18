'use server';

import { cookies } from 'next/headers';
import {
  acceptInstructorChat,
  fetchChatMessages,
  fetchInstructorActiveChats,
  fetchInstructorMessages,
  fetchInstructorPendingChats,
  fetchStudentChatRooms,
  leaveInstructorChat,
  rejectInstructorChat,
} from '@/services/coffee-chat.service';
import { ChatMessageEvent, InstructorChatRoom, StudentChatRoom } from './types';

export async function fetchStudentChatRoomsAction(): Promise<StudentChatRoom[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchStudentChatRooms(accessToken);
}

export async function fetchInstructorPendingChatsAction(): Promise<InstructorChatRoom[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchInstructorPendingChats(accessToken);
}

export async function fetchInstructorActiveChatsAction(): Promise<InstructorChatRoom[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchInstructorActiveChats(accessToken);
}

export async function fetchChatMessagesAction(chatId: number): Promise<ChatMessageEvent[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchChatMessages(accessToken, chatId);
}

export async function fetchInstructorMessagesAction(chatId: number): Promise<ChatMessageEvent[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return [];

  return fetchInstructorMessages(accessToken, chatId);
}

export async function acceptInstructorChatAction(chatId: number): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return false;

  return acceptInstructorChat(accessToken, chatId);
}

export async function rejectInstructorChatAction(chatId: number): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return false;

  return rejectInstructorChat(accessToken, chatId);
}

export async function leaveInstructorChatAction(chatId: number): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return false;

  return leaveInstructorChat(accessToken, chatId);
}
