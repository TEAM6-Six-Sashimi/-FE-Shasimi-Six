import CourseEditForm from '@/features/user/mycourses-instructor/components/new-course/CourseEditForm';
import { fetchCategories } from '@/services/categories.service';
import { cookies } from 'next/headers';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import { fetchCourseDetail } from '@/services/instructor.service';
import { AuthSessionError } from '@/features/auth/errors';
import SessionExpiredRedirect from '@/components/layout/SessionExpiredRedirect';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  let user;
  try {
    user = await fetchUserMeStrict(accessToken);
  } catch (error) {
    if (error instanceof UserMeAuthError) {
      const message = (await parseAuthErrorMessage(error.response)) ?? '다시 로그인해주세요.';
      return <SessionExpiredRedirect message={message} />;
    }
    throw error;
  }

  let categories, course;
  try {
    [categories, course] = await Promise.all([
      fetchCategories(),
      fetchCourseDetail(accessToken, String(user.id), Number(courseId)),
    ]);
  } catch (error) {
    // 세션이 완전히 끊긴 경우 - 로그아웃 처리
    if (error instanceof AuthSessionError) {
      return <SessionExpiredRedirect message={error.message} />;
    }
    throw error;
  }

  const DIFFICULTY_REVERSE: Record<string, string> = {
    BEGINNER: '초급',
    INTERMEDIATE: '중급',
    ADVANCED: '고급',
  };

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
      durationSeconds: s.durationSeconds ?? 0,
      materialUrl: s.attachmentUrl ?? '',
      materialName: s.attachmentName ?? '',
      materialType: s.attachmentType ?? '',
      materialSize: s.attachmentSize ?? 0,
      preview: s.preview,
    })) ?? [
      { id: 1, title: '', videoUrl: '', durationSeconds: 0, materialUrl: '', preview: false },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <CourseEditForm categories={categories} initialData={initialData} />
    </div>
  );
}
