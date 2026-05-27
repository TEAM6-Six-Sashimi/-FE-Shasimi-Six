import { CourseFromAPI } from "@/features/user/courses/types";

export async function fetchCourses(
  categoryName: string,
  subCategory?: string,
): Promise<CourseFromAPI[]> {
  try {
    const params = new URLSearchParams({ categoryName });
    if (subCategory) params.set('subCategory', subCategory);

    const res = await fetch(`http://localhost:8080/api/courses?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();

    // _debugInfo 등 불필요한 항목 제거하고 순수 강의 데이터만 추출
    return Array.isArray(data)
      ? data.filter((item) => typeof item === 'object' && item !== null && 'title' in item)
      : [];
  } catch {
    return [];
  }
}