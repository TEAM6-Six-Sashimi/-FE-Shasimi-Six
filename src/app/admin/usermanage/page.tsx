import { cookies } from 'next/headers';
import {
  fetchInstructorApplications,
  fetchAdminUsers,
  fetchRejectedInstructorApplications,
} from '@/services/admin-usermanage.service';
import UserManagePage from './_components/UserManagePage';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  let applications, users, rejected;
  try {
    [applications, users, rejected] = await Promise.all([
      fetchInstructorApplications(accessToken),
      fetchAdminUsers(accessToken),
      fetchRejectedInstructorApplications(accessToken),
    ]);
  } catch (error) {
    if (error instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={error.message} />;
    }
    return (
      <div className="max-w-5xl mx-auto py-16 text-center text-[#6A7282]">
        <p className="text-[15px] font-semibold text-[#1E2125] mb-1">
          회원 목록을 불러오지 못했습니다.
        </p>
        <p className="text-[13px]">
          {error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.'}
        </p>
      </div>
    );
  }

  return <UserManagePage applications={applications} users={users} rejected={rejected} />;
}