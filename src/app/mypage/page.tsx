import { cookies } from 'next/headers';
import { fetchUserMe, GUEST_USER } from '@/services/user.service';
import MypageMain from '@/features/mypage/components/personal-Info/MypageMain';
import { withAgreements } from '@/features/mypage/types';

export default async function UserMyPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const rawUser = accessToken ? await fetchUserMe(accessToken) : GUEST_USER;
  const user = withAgreements(rawUser);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">개인정보 조회</h1>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
        <MypageMain user={user} />
      </div>
    </div>
  );
}
