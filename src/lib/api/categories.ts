export interface Category {
  name: string;
  subCategories: string[];
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('http://localhost:8080/api/categories?type=COURSE', {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}