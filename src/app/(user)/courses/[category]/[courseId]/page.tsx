import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchCourseDetail } from '@/services/course.service';
import { fetchCategories } from '@/services/categories.service';
import { fetchUserMe } from '@/services/user.service';
import CourseDetailPage from './_components/CourseDetailPage';
import { getThumbnailUrl } from '@/lib/thumbnail';

interface PageProps {
  params: Promise<{ category: string; courseId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  const course = await fetchCourseDetail(courseId);

  if (!course) return {};

  const thumbnailUrl = getThumbnailUrl(course.thumbnail);

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: `${course.title} | 핏(Fit)-격`,
      description: course.description,
      url: `/courses/${encodeURIComponent(course.categoryName)}/${courseId}`,
      images: thumbnailUrl
        ? [{ url: thumbnailUrl, width: 1200, height: 630, alt: course.title }]
        : [{url: '/FitGyeok-share2.png', width: 1200, height: 630, alt: '핏(Fit)-격 로고' }],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { courseId } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const [course, categories, user] = await Promise.all([
    fetchCourseDetail(courseId, accessToken),
    fetchCategories(),
    accessToken ? fetchUserMe(accessToken) : Promise.resolve(null),
  ]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6A7282]">
        강의 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <CourseDetailPage
      course={course}
      categories={categories}
      currentUserLoginId={user?.loginId ?? null}
    />
  );
}
