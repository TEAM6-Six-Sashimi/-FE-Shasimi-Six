import { fetchCategories } from '@/lib/api/categories';
import CourseListPage from './_components/CourseListPage';

export default async function Page() {
  const categories = await fetchCategories();
  return <CourseListPage categories={categories} />;
}