import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchUserMeStrict, GUEST_USER } from '@/services/user.service';
import {
  fetchInstructorPendingChatsAction,
  fetchStudentChatRoomsAction,
} from '@/features/user/coffee-chat/actions';
import CoffeeChatPageClient from '@/features/user/coffee-chat/components/CoffeeChatPageClient';

export const metadata: Metadata = {
  title: '커피챗',
  description: '수강 중인 강의의 강사와 네트워킹하며 커리어 고민을 가볍게 나눠보세요.',
};

export default async function CoffeeChatPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let user = GUEST_USER;
  if (accessToken) {
    try {
      user = await fetchUserMeStrict(accessToken);
    } catch {
      // 세션이 죽은 경우 - 게스트로 표시
    }
  }

  const isInstructor = user.role === 'INSTRUCTOR';
  const studentChatRooms = isInstructor ? [] : await fetchStudentChatRoomsAction();
  const instructorPendingChats = isInstructor ? await fetchInstructorPendingChatsAction() : [];

  return (
    <CoffeeChatPageClient
      role={user.role}
      userId={user.id}
      studentChatRooms={studentChatRooms}
      instructorPendingChats={instructorPendingChats}
    />
  );
}
