import { cookies } from 'next/headers';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import UserSidebar from '@/components/layout/UserSidebar';
import Footer from '@/components/layout/Footer';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';
import { MypagePasswordProvider } from '@/features/mypage/MypagePasswordContext';

export default async function UserMypageLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  if (!accessToken) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  try {
    const user = await fetchUserMeStrict(accessToken);

    return (
      <MypagePasswordProvider>
        <div className="flex flex-col">
          <div className="flex flex-row flex-1 min-h-screen">
            <UserSidebar role={user.role} />
            <main className="flex-1 px-4 py-8 bg-[#F9FAFB]">{children}</main>
          </div>
          <Footer />
        </div>
      </MypagePasswordProvider>
    );
  } catch (error) {
    // 마이페이지 하위 전체를 보호 - 세션이 죽은 상태면 로그아웃 처리
    if (error instanceof UserMeAuthError) {
      const message = (await parseAuthErrorMessage(error.response)) ?? '다시 로그인해주세요.';
      return <SessionExpiredRedirect message={message} />;
    }
    throw error;
  }
}
