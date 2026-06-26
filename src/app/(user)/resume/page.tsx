import { cookies } from 'next/headers';
import { fetchUserMe, GUEST_USER } from '@/services/user.service';
import { fetchMyResume } from '@/services/ai.service';
import ResumePageClient from '@/features/user/resume/components/ResumePageClient';

export default async function ResumePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
 
  const [user, savedResume] = await Promise.all([
    accessToken ? fetchUserMe(accessToken) : Promise.resolve(GUEST_USER),
    accessToken ? fetchMyResume(accessToken) : Promise.resolve(null),
  ]);
 
  return (
    <ResumePageClient
      userName={user.name}
      userPhone={user.phone}
      userEmail={user.email}
      savedResume={savedResume}
    />
  );
}