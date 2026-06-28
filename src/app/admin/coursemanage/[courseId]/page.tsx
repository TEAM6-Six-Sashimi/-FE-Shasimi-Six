import { cookies } from 'next/headers';
import { fetchCourseDetail } from '@/services/course.service';
import { fetchCategories } from '@/services/categories.service';
import AdminCourseDetail from './components/AdminCourseDetailPage';


interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function AdminCourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // 강의 상세 조회 (viewerType=ADMIN, status로 PENDING/APPROVED/CLOSED/REJECTED 구분)
  const [course, categories] = await Promise.all([
    fetchCourseDetail(courseId, accessToken),
    fetchCategories(),
  ]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return <AdminCourseDetail course={course} categories={categories} />;
}