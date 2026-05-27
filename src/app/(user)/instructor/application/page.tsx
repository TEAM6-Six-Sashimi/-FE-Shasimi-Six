import InstructorApplicationClient from '@/features/user/instructor-application/_components/InstructorApplicationClient';
import { fetchUserInfo } from '@/lib/api/users';

export default async function InstructorApplicationPage() {
  const userInfo = await fetchUserInfo();
  return (
    <div className='bg-[#F9FAFB]'>
      <InstructorApplicationClient userInfo={userInfo} />;
    </div>
  );
}
