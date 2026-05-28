import Link from 'next/link';
import Dashboard from '@/features/user/mycourses-instructor/components/Dashboard';
import ApprovedCourse from '@/features/user/mycourses-instructor/components/ApprovedCourse';
import PendingCourse from '@/features/user/mycourses-instructor/components/PendingCourse';
import type { InstructorTab } from '@/constants/mockInstructorCourses';

const TABS: { id: InstructorTab; label: string }[] = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'approved',  label: '승인된 강의' },
  { id: 'pending',   label: '대기/보관/반려' },
];

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function MyCoursesInstructorPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab: InstructorTab =
    tab === 'approved' || tab === 'pending' ? tab : 'dashboard';

  return (
    <div className="max-w-275 container mx-auto px-6 py-8">
      {/* 타이틀 */}
      <h1 className="text-[24px] font-bold text-[#1E2125] mb-5">내 강의</h1>

      {/* 탭 */}
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

      {/* 탭 콘텐츠 */}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'approved'  && <ApprovedCourse />}
      {activeTab === 'pending'   && <PendingCourse />}
    </div>
  );
}