import { cookies } from 'next/headers';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { fetchInstructorProfile } from '@/services/instructor.service';
import InstructorProfileView from '@/features/mypage/components/instructor-profile/InstructorProfileView';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function InstructorProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  let user;
  try {
    user = await fetchUserMeStrict(accessToken);
  } catch (error) {
    if (error instanceof UserMeAuthError) {
      const message = (await parseAuthErrorMessage(error.response)) ?? '다시 로그인해주세요.';
      return <SessionExpiredRedirect message={message} />;
    }
    throw error;
  }

  let profile;
  try {
    profile = await fetchInstructorProfile(user.id, accessToken);
  } catch (e) {
    // 동시 접속 등으로 세션이 완전히 끊긴 경우 - 로그아웃 처리
    if (e instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={e.message} />;
    }
    throw e;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">강사 프로필</h1>
      {profile ? (
        <InstructorProfileView profile={profile} />
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm text-[#6A7282]">
          프로필 정보를 불러올 수 없습니다.
        </div>
      )}
    </div>
  );
}
