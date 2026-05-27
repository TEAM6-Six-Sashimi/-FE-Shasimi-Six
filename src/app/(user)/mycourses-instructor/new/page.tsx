import { fetchCategories } from '@/lib/api/categories';
import CourseRegisterForm from '@/features/user/mycourses-instructor/components/CourseRegisterForm';

export default async function NewCoursePage() {
  const categories = await fetchCategories();
  return (
    <div className='min-h-screen bg-[#F9FAFB]'>
      <CourseRegisterForm categories={categories} />;
    </div>
  );
}
