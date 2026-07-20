import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchUserMeStrict, GUEST_USER } from '@/services/user.service';
import {
  fetchInstructorActiveChatsAction,
  fetchInstructorPendingChatsAction,
  fetchStudentChatRoomsAction,
} from '@/features/user/coffee-chat/actions';
import CoffeeChatPageClient from '@/features/user/coffee-chat/components/CoffeeChatPageClient';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

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

  let studentChatRooms, instructorPendingChats, instructorActiveChats;
  try {
    studentChatRooms = isInstructor ? [] : await fetchStudentChatRoomsAction();
    instructorPendingChats = isInstructor ? await fetchInstructorPendingChatsAction() : [];
    instructorActiveChats = isInstructor ? await fetchInstructorActiveChatsAction() : [];
  } catch (e) {
    // 동시 접속 등으로 세션이 완전히 끊긴 경우 - 로그아웃 처리
    if (e instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={e.message} />;
    }
    throw e;
  }

  return (
    <CoffeeChatPageClient
      role={user.role}
      userId={user.id}
      studentChatRooms={studentChatRooms}
      instructorPendingChats={instructorPendingChats}
      instructorActiveChats={instructorActiveChats}
    />
  );
}
