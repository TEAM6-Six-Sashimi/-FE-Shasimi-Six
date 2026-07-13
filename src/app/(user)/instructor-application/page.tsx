import { cookies } from 'next/headers';
import InstructorApplicationClient from '@/features/user/instructor-application/_components/InstructorApplicationClient';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import { fetchCategories } from '@/services/categories.service';
import { fetchMyInstructorApplications } from '@/services/instructor-application.service';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

export default async function InstructorApplicationPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  let userInfo;
  try {
    userInfo = await fetchUserMeStrict(accessToken);
  } catch (error) {
    if (error instanceof UserMeAuthError) {
      const message = (await parseAuthErrorMessage(error.response)) ?? '다시 로그인해주세요.';
      return <SessionExpiredRedirect message={message} />;
    }
    throw error;
  }

  const categories = await fetchCategories();
  const applications = await fetchMyInstructorApplications(userInfo.id, accessToken);
  const hasPendingApplication = applications.some((app) => app.approvalStatus === 'PENDING');

  return (
    <div className="bg-[#F9FAFB]">
      <InstructorApplicationClient
        userInfo={userInfo}
        categories={categories}
        hasPendingApplication={hasPendingApplication}
      />
    </div>
  );
}