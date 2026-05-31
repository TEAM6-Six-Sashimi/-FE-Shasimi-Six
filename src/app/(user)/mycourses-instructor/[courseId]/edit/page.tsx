import CourseEditForm from '@/features/user/mycourses-instructor/components/CourseEditForm';
import { fetchCategories } from '@/services/categories.service';
import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';
import { fetchInProgressCourses } from '@/services/instructor.service';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const [categories, user] = await Promise.all([fetchCategories(), fetchUserMe(accessToken)]);

  // in-progress 목록에서 해당 강의 찾기
  const courses = user ? await fetchInProgressCourses(accessToken, String(user.id)) : [];
  const course = courses.find((c) => c.courseId === Number(courseId));

  const DIFFICULTY_REVERSE: Record<string, string> = {
    BEGINNER: '초급',
    INTERMEDIATE: '중급',
    ADVANCED: '고급',
  };

  // categoryId로 카테고리/서브카테고리 이름 찾기
  const findCategoryInfo = (categoryId: number) => {
    for (const cat of categories) {
      const option = cat.options?.find((o) => o.id === categoryId);
      if (option) return { category: cat.name, subCategory: String(option.id) };
    }
    return { category: '', subCategory: '' };
  };

  const categoryInfo = course
    ? findCategoryInfo(course.categoryId)
    : { category: '', subCategory: '' };

  const initialData = {
    courseId: Number(courseId),
    categoryId: course?.categoryId ?? 0,
    title: course?.title ?? '',
    description: course?.description ?? '',
    category: categoryInfo.category,
    subCategory: categoryInfo.subCategory,
    price: course?.price ?? 0,
    level: DIFFICULTY_REVERSE[course?.difficulty ?? 'BEGINNER'] ?? '초급',
    thumbnail: course?.thumbnail ?? '',
    sessions: course?.sessions?.map((s) => ({
      id: s.sessionId,
      title: s.title,
      videoUrl: s.videoUrl,
      materialUrl: s.attachmentUrl ?? '',
      preview: s.preview,
    })) ?? [{ id: 1, title: '', videoUrl: '', materialUrl: '', preview: false }],
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <CourseEditForm categories={categories} initialData={initialData} />
    </div>
  );
}
