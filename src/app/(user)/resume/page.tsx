import { cookies } from 'next/headers';
import { fetchUserMe, GUEST_USER } from '@/services/user.service';
import ResumePageClient from '@/features/user/resume/components/ResumePageClient';

export default async function ResumePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const user = accessToken ? await fetchUserMe(accessToken) : GUEST_USER;

  return <ResumePageClient userName={user.name} userPhone={user.phone} userEmail={user.email} />;
}