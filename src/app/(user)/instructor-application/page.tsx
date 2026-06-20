import { cookies } from 'next/headers';
import InstructorApplicationClient from '@/features/user/instructor-application/_components/InstructorApplicationClient';
import { fetchUserMe } from '@/services/user.service';
import { fetchCategories } from '@/services/categories.service';

export default async function InstructorApplicationPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const [userInfo, categories] = await Promise.all([
    fetchUserMe(accessToken),
    fetchCategories(),
  ]);

  return (
    <div className="bg-[#F9FAFB]">
      <InstructorApplicationClient userInfo={userInfo} categories={categories} />
    </div>
  );
}