
import { fetchCategories } from '@/services/categories.service';
import CourseListPage from './_components/CourseListPage';
import { fetchCourses } from '@/services/course.service';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string }>;
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

  return (
    <CourseListPage
      categories={categories}
      initialCourses={initialCourses}
    />
  );
}