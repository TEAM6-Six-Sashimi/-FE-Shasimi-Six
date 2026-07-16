import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchMyInstructorApplications } from '@/services/instructor-application.service';
import { fetchCategories } from '@/services/categories.service';
import InstructorApplicationHistoryTable from '@/features/mypage/components/instructor-apply-history/InstructorApplicationHistoryTable';


export default async function InstructorApplicationListPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center text-[#6A7282]">
        로그인이 필요합니다.
      </div>
    );
  }

  const user = await fetchUserMe(accessToken);
  const [applications, categories] = await Promise.all([
    fetchMyInstructorApplications(user.id, accessToken),
    fetchCategories(),
  ]);

   return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">강사 지원 내역</h1>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
          <InstructorApplicationHistoryTable applications={applications} categories={categories} />
        </div>
      </div>
    ); 
}
