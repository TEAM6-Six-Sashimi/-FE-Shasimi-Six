import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchMyInstructorApplicationDetail } from '@/services/instructor-application.service';
import { fetchCategories } from '@/services/categories.service';
import InstructorApplicationDetailView from '@/features/mypage/components/instructor-apply-history/InstructorApplicationDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InstructorApplicationDetailPage({ params }: Props) {
  const { id } = await params;
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
  const [detail, categories] = await Promise.all([
    fetchMyInstructorApplicationDetail(user.id, Number(id), accessToken),
    fetchCategories(),
  ]);

  if (!detail) {
    return (
      <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center text-[#6A7282]">
        지원 내역을 불러올 수 없습니다.
      </div>
    );
  }

  const categoryName =
    categories.find((cat) => cat.mainCategoryId === detail.categoryId)?.name ?? '-';

  return <InstructorApplicationDetailView detail={detail} categoryName={categoryName} />;
}
