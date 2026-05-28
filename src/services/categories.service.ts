import { Category } from '@/features/categories/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}
