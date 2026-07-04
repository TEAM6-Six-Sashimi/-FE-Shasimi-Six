import { cookies } from 'next/headers';
import {
  fetchInstructorApplications,
  fetchAdminUsers,
  fetchRejectedInstructorApplications,
} from '@/services/admin.service';
import UserManagePage from './_components/UserManagePage';

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const [applications, users, rejected] = await Promise.all([
    fetchInstructorApplications(accessToken),
    fetchAdminUsers(accessToken),
    fetchRejectedInstructorApplications(accessToken),
  ]);

  return <UserManagePage applications={applications} users={users} rejected={rejected} />;
}