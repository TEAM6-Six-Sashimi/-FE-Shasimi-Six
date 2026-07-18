import { MetadataRoute } from 'next';
import { fetchCourses } from '@/services/course.service';
import { fetchNotices } from '@/services/notice.service';

const BASE_URL = 'https://www.sixsashimi.com.market-app.org';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 카테고리 목록 조회 (동적 경로 생성용)
async function fetchCategoryNames(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      next: { revalidate: 3600 }, // 카테고리는 자주 안 바뀌므로 1시간 캐싱
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((cat: { name: string }) => cat.name);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryNames = await fetchCategoryNames();

  // 정적 공개 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ai-subscribe`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/recommendations`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ai-analysis`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coffee-chat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/notice`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // 동적 카테고리 페이지 (/courses/[category])
  const categoryPages: MetadataRoute.Sitemap = categoryNames.map((name) => ({
    url: `${BASE_URL}/courses/${encodeURIComponent(name)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 동적 강의 상세 페이지 (/courses/[category]/[courseId])
  const coursesByCategory = await Promise.all(
    categoryNames.map((name) => fetchCourses(name)),
  );
  const coursePages: MetadataRoute.Sitemap = coursesByCategory.flat().map((course) => ({
    url: `${BASE_URL}/courses/${encodeURIComponent(course.categoryName)}/${course.courseId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 동적 공지사항 상세 페이지 (/notice/[id]) - 로그인 불필요한 공개 게시판
  const noticeList = await fetchNotices({ page: 0, size: 100 });
  const noticePages: MetadataRoute.Sitemap = noticeList.items.map((notice) => ({
    url: `${BASE_URL}/notice/${notice.noticeId}`,
    lastModified: new Date(notice.createdDate),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...coursePages, ...noticePages];
}