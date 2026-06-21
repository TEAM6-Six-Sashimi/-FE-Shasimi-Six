import { cookies } from 'next/headers';
import { fetchUserMe, GUEST_USER } from '@/services/user.service';
import MypageMain from '@/features/mypage/components/MypageMain';

export default async function UserMyPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const user = accessToken ? await fetchUserMe(accessToken) : GUEST_USER;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">개인정보 조회</h1>
      <div className="bg-white rounded-xl p-6 shadow-md">
        <MypageMain user={user} />
      </div>
    </div>
  );
}
