import { cookies } from 'next/headers';
import { fetchCourseDetail, fetchPaymentInfo } from '@/services/course.service';
import { fetchCategories } from '@/services/categories.service';
import CourseDetailPage from './_components/CourseDetailPage';
import CourseDetailPageOwned from './_components/CourseDetailPageOwned';

interface PageProps {
  params: Promise<{ category: string; courseId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // 강의 상세 + 수강 여부 조회
  const [course, paymentInfo, categories] = await Promise.all([
    fetchCourseDetail(courseId, accessToken),
    accessToken ? fetchPaymentInfo(courseId, accessToken) : Promise.resolve(null),
    fetchCategories(),
  ]);

  // 강의 정보 조회 실패
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const isPurchased = paymentInfo !== null;

  return isPurchased ? (
    <CourseDetailPageOwned course={course} categories={categories} paymentInfo={paymentInfo!} />
  ) : (
    <CourseDetailPage course={course} categories={categories} />
  );
}
