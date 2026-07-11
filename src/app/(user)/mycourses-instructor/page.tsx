import { cookies } from 'next/headers';
import Link from 'next/link';
import Dashboard from '@/features/user/mycourses-instructor/components/Dashboard';
import ApprovedCourse from '@/features/user/mycourses-instructor/components/ApprovedCourse';
import PendingCourse from '@/features/user/mycourses-instructor/components/PendingCourse';
import PrivateCourse from '@/features/user/mycourses-instructor/components/PrivateCourse';
import { fetchCategories } from '@/services/categories.service';
import {
  fetchApprovedCourses,
  fetchInProgressCourses,
  fetchClosedCourses,
} from '@/services/instructor.service';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

type InstructorTab = 'dashboard' | 'approved' | 'pending' | 'private';

const TABS: { id: InstructorTab; label: string }[] = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'approved', label: '승인된 강의' },
  { id: 'pending', label: '대기/보관/반려' },
  { id: 'private', label: '비공개된 강의' },
];

const VALID_TABS: InstructorTab[] = ['approved', 'pending', 'private'];

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyCoursesInstructorPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab: InstructorTab = VALID_TABS.includes(tab as InstructorTab)
    ? (tab as InstructorTab)
    : 'dashboard';

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let user = null;
  if (accessToken) {
    try {
      user = await fetchUserMeStrict(accessToken);
    } catch (error) {
      if (error instanceof UserMeAuthError) {
        const message = (await parseAuthErrorMessage(error.response)) ?? '다시 로그인해주세요.';
        return <SessionExpiredRedirect message={message} />;
      }
      throw error;
    }
  }
  const userId = user ? String(user.id) : '';

  const [approvedCourses, inProgressCourses, closedCourses, categories] =
    accessToken && userId
      ? await Promise.all([
          activeTab === 'approved'
            ? fetchApprovedCourses(accessToken, userId)
            : Promise.resolve([]),

          activeTab === 'pending'
            ? fetchInProgressCourses(accessToken, userId)
            : Promise.resolve([]),

          activeTab === 'private' ? fetchClosedCourses(accessToken, userId) : Promise.resolve([]),

          fetchCategories(),
        ])
      : [[], [], [], []];

  return (
    <div className="max-w-275 min-h-[calc(100vh-95px)] container mx-auto px-6 py-8">
      <h1 className="text-[24px] font-bold text-[#1E2125] mb-5">내 강의</h1>

      <div className="flex items-center gap-0 border-b border-[#E5E7EB] mb-6">
        {TABS.map(({ id, label }) => {
          // 기본 탭(dashboard)은 쿼리 없는 깨끗한 URL, 그 외는 ?tab= 포함
          const href =
            id === 'dashboard' ? '/mycourses-instructor' : `/mycourses-instructor?tab=${id}`;
          return (
            <Link
              key={id}
              href={href}
              className={`px-5 py-3 text-[13.5px] font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
                activeTab === id
                  ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                  : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'approved' && (
        <ApprovedCourse courses={approvedCourses} categories={categories} />
      )}
      {activeTab === 'pending' && (
        <PendingCourse courses={inProgressCourses} categories={categories} />
      )}
      {activeTab === 'private' && <PrivateCourse courses={closedCourses} categories={categories} />}
    </div>
  );
}
