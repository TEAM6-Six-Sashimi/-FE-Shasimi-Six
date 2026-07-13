import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchInstructorProfile } from '@/services/instructor.service';
import InstructorProfileView from '@/features/mypage/components/instructor-profile/InstructorProfileView';

export default async function InstructorProfilePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  const user = await fetchUserMe(accessToken);
  const profile = await fetchInstructorProfile(user.id, accessToken);

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
