import CourseRegisterForm from '@/features/user/mycourses-instructor/components/CourseRegisterForm';
import { fetchCategories } from '@/services/categories.service';

export default async function NewCoursePage() {
  const categories = await fetchCategories();
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <CourseRegisterForm categories={categories} />
    </div>
  );
}
