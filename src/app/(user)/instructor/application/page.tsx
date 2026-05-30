import { cookies } from 'next/headers';
import InstructorApplicationClient from '@/features/user/instructor-application/_components/InstructorApplicationClient';
import { fetchUserMe } from '@/services/user.service';

export default async function InstructorApplicationPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';
  const userInfo = await fetchUserMe(accessToken);

  return (
    <div className="bg-[#F9FAFB]">
      <InstructorApplicationClient userInfo={userInfo} />
    </div>
  );
}