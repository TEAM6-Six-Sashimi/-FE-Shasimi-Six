import CourseDetailPage from './_components/CourseDetailPage';
import CourseDetailPageOwned from './_components/CourseDetailPageOwned';

interface PageProps {
  params: Promise<{ category: string; courseId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;

  // TODO: 실제 구매 여부 API 연결
  // const isPurchased = await checkPurchased(courseId);
  const isPurchased = false; // 임시 목업

  return isPurchased ? <CourseDetailPageOwned /> : <CourseDetailPage />;
}