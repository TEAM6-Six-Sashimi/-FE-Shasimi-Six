import { cookies } from 'next/headers';
import { fetchInstructorApplications } from '@/services/admin.service';
import UserManagePage from './_components/UserManagePage';

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const applications = await fetchInstructorApplications(accessToken);

  return <UserManagePage applications={applications} />;
}
