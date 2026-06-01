import { cookies } from 'next/headers';
import Link from 'next/link';
import Dashboard from '@/features/user/mycourses-instructor/components/Dashboard';
import ApprovedCourse from '@/features/user/mycourses-instructor/components/ApprovedCourse';
import PendingCourse from '@/features/user/mycourses-instructor/components/PendingCourse';
import { fetchCategories } from '@/services/categories.service';
import { fetchApprovedCourses, fetchInProgressCourses } from '@/services/instructor.service';
import { fetchUserMe } from '@/services/user.service';

type InstructorTab = 'dashboard' | 'approved' | 'pending';

const TABS: { id: InstructorTab; label: string }[] = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'approved', label: '승인된 강의' },
  { id: 'pending', label: '대기/보관/반려' },
];

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyCoursesInstructorPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab: InstructorTab = tab === 'approved' || tab === 'pending' ? tab : 'dashboard';

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const user = accessToken ? await fetchUserMe(accessToken) : null;
  const userId = user ? String(user.id) : '';

  const [approvedCourses, inProgressCourses, categories] =
    accessToken && userId
      ? await Promise.all([
          activeTab === 'approved'
            ? fetchApprovedCourses(accessToken, userId)
            : Promise.resolve([]),
          activeTab === 'pending'
            ? fetchInProgressCourses(accessToken, userId)
            : Promise.resolve([]),
          fetchCategories(),
        ])
      : [[], [], []];

  return (
    <div className="max-w-275 container mx-auto px-6 py-8">
      <h1 className="text-[24px] font-bold text-[#1E2125] mb-5">내 강의</h1>

      <div className="flex items-center gap-0 border-b border-[#E5E7EB] mb-6">
        {TABS.map(({ id, label }) => (
          <Link
            key={id}
            href={`/mycourses-instructor?tab=${id}`}
            className={`px-5 py-3 text-[13.5px] font-medium whitespace-nowrap border-b-2 transition-colors duration-150 ${
              activeTab === id
                ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'approved' && (
        <ApprovedCourse courses={approvedCourses} categories={categories} />
      )}
      {activeTab === 'pending' && (
        <PendingCourse courses={inProgressCourses} categories={categories} />
      )}
    </div>
  );
}
