import { cookies } from 'next/headers';
import Footer from '@/components/layout/Footer';
import Menubar from '@/components/layout/Menubar';
import { CoffeeChatAlertProvider } from '@/features/header/components/CoffeeChatAlertContext';
import { fetchCategories } from '@/services/categories.service';
import { fetchUserMe } from '@/services/user.service';
import CareerCounselingButton from '@/features/user/ai-chatbot/components/CareerCounselingButton';
import {
  fetchInstructorActiveChatsAction,
  fetchInstructorPendingChatsAction,
  fetchStudentChatRoomsAction,
} from '@/features/user/coffee-chat/actions';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const [categories, user] = await Promise.all([
    fetchCategories(),
    accessToken ? fetchUserMe(accessToken) : Promise.resolve(null),
  ]);

  const role = user?.role === 'STUDENT' || user?.role === 'INSTRUCTOR' ? user.role : 'GUEST';

  // 상단 메뉴 "커피챗" 아이콘에 안읽음 알림 점을 띄우기 위한 체크
  let hasCoffeeChatAlert = false;
  try {
    if (role === 'STUDENT') {
      const rooms = await fetchStudentChatRoomsAction();
      hasCoffeeChatAlert = rooms.some((room) => room.unreadMessageCount > 0);
    } else if (role === 'INSTRUCTOR') {
      const [pendingChats, activeChats] = await Promise.all([
        fetchInstructorPendingChatsAction(),
        fetchInstructorActiveChatsAction(),
      ]);
      hasCoffeeChatAlert = [...pendingChats, ...activeChats].some(
        (chat) => chat.unreadMessageCount > 0,
      );
    }
  } catch (e) {
    // 세션이 완전히 끊긴 경우 - 에러 화면 방지용
    if (e instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={e.message} />;
    }
    // 배지 표시는 부가 기능이므로, 그 외 실패(네트워크 오류 등)는 조용히 무시하고 hasCoffeeChatAlert 기본값(false)으로 계속 진행 - 전체 페이지를 막지 않기 위함
  }

  return (
    <CoffeeChatAlertProvider initialHasAlert={hasCoffeeChatAlert}>
      <div className="min-h-screen flex flex-col">
        <Menubar categories={categories} role={role} />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* 챗봇 버튼 */}
        <CareerCounselingButton />
      </div>
    </CoffeeChatAlertProvider>
  );
}
