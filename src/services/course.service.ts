import { CourseFromAPI } from "@/features/user/courses/types";

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
      `http://localhost:8080/api/courses?${params.toString()}`,
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