import { cookies } from 'next/headers';
import Footer from '@/components/layout/Footer';
import Menubar from '@/components/layout/Menubar';
import { fetchCategories } from '@/services/categories.service';
import { fetchUserMe } from '@/services/user.service';
import CareerCounselingButton from '@/features/user/ai-chatbot/components/CareerCounselingButton';
import {
  fetchInstructorActiveChatsAction,
  fetchInstructorPendingChatsAction,
  fetchStudentChatRoomsAction,
} from '@/features/user/coffee-chat/actions';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const [categories, user] = await Promise.all([
    fetchCategories(),
    accessToken ? fetchUserMe(accessToken) : Promise.resolve(null),
  ]);

  const role = user?.role === 'STUDENT' || user?.role === 'INSTRUCTOR' ? user.role : 'GUEST';

  // 상단 메뉴 "커피챗" 아이콘에 안읽음 알림 점을 띄우기 위한 체크.
  // 학생은 안읽은 메시지가 있는 방이 있는지, 강사는 대기 중인 요청이 있거나
  // 안읽은 메시지가 있는 채팅방이 있는지로 판단한다.
  let hasCoffeeChatAlert = false;
  if (role === 'STUDENT') {
    const rooms = await fetchStudentChatRoomsAction();
    hasCoffeeChatAlert = rooms.some((room) => room.unreadMessageCount > 0);
  } else if (role === 'INSTRUCTOR') {
    const [pendingChats, activeChats] = await Promise.all([
      fetchInstructorPendingChatsAction(),
      fetchInstructorActiveChatsAction(),
    ]);
    hasCoffeeChatAlert =
      pendingChats.length > 0 || activeChats.some((chat) => chat.unreadMessageCount > 0);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Menubar categories={categories} role={role} hasCoffeeChatAlert={hasCoffeeChatAlert} />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* 진로 상담 챗봇 버튼 */}
      <CareerCounselingButton />
    </div>
  );
}
