import { CourseFromAPI } from "@/features/user/courses/types";
import { StudentCourse } from "@/features/user/mycourses-student/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCourses(
  categoryName: string,
  subCategory?: string,
): Promise<CourseFromAPI[]> {
  try {
    const params = new URLSearchParams({
      categoryName,
    });

    if (subCategory) {
      params.set('categoryId', subCategory);
    }

    const res = await fetch(
      `${API_BASE_URL}/api/courses?${params.toString()}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) return [];

    const data = await res.json();

    return Array.isArray(data)
      ? data.filter(
          (item) =>
            typeof item === 'object' &&
            item !== null &&
            'title' in item,
        )
      : [];
  } catch {
    return [];
  }
}


// ====== 수강생 내 강의 =============================
export async function fetchStudentCourses(
  accessToken: string,
  userId: string,
): Promise<StudentCourse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/student/courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-USER-ID': userId,
      },
      cache: 'no-store',
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}