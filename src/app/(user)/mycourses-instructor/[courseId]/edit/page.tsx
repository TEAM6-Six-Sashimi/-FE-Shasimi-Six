import CourseEditForm from '@/features/user/mycourses-instructor/components/CourseEditForm';
import { fetchCategories } from '@/services/categories.service';
import { MOCK_COURSE_DETAIL } from '@/constants/mockCourseDetail';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const categories = await fetchCategories();

  // TODO: courseId로 실제 강의 데이터 fetch
  // const course = await fetchCourseById(Number(courseId));
  const course = MOCK_COURSE_DETAIL;

  const initialData = {
    title: course.title,
    description: course.description,
    category: course.category,
    subCategory: course.subCategory,
    price: course.price,
    level: course.level,
    thumbnailFile: null,
    lectures: course.curriculum.map((item) => ({
      id: item.id,
      title: item.title,
      videoUrl: '',
      materialFile: null,
      isFree: item.isPreview,
    })),
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <CourseEditForm categories={categories} initialData={initialData} />
    </div>
  );
}