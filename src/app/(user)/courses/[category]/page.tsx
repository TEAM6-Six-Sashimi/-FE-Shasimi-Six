import { Metadata } from 'next';
import { fetchCategories } from '@/services/categories.service';
import CourseListPage from './_components/CourseListPage';
import { fetchCourses } from '@/services/course.service';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const title = `${decodedCategory}`;
  const description = `핏격에서 ${decodedCategory} 관련 다양한 강의를 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | 핏(Fit)-격`,
      description,
      url: `/courses/${category}`,
    },
  };
}


export default async function Page({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { sub } = await searchParams;

  const decodedCategory = decodeURIComponent(category);
  const decodedSub = sub ? decodeURIComponent(sub) : undefined;

  const [categories, initialCourses] = await Promise.all([
    fetchCategories(),
    fetchCourses(decodedCategory, decodedSub),
  ]);

  return <CourseListPage categories={categories} initialCourses={initialCourses} />;
}