import { MetadataRoute } from 'next';
import { fetchCourses } from '@/services/course.service';
import { fetchNotices } from '@/services/notice.service';

const BASE_URL = 'https://www.sixsashimi.com.market-app.org';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 실제 콘텐츠가 거의 안 바뀌는 정적 페이지들 - 실제 마지막 변경일을 고정값으로 관리한다 (내용이 바뀌면 이 날짜도 갱신)
const STATIC_CONTENT_LAST_MODIFIED = new Date('2026-07-20');

// 카테고리 목록 조회 (동적 경로 생성용)
async function fetchCategoryNames(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      next: { revalidate: 3600 },
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
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ai-subscribe`,
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/recommendations`,
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ai-analysis`,
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/website-about`,
      lastModified: STATIC_CONTENT_LAST_MODIFIED,
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

  // 동적 카테고리 페이지
  const categoryPages: MetadataRoute.Sitemap = categoryNames.map((name) => ({
    url: `${BASE_URL}/courses/${encodeURIComponent(name)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 동적 강의 상세 페이지
  const coursesByCategory = await Promise.all(categoryNames.map((name) => fetchCourses(name)));
  const coursePages: MetadataRoute.Sitemap = coursesByCategory.flat().map((course) => ({
    url: `${BASE_URL}/courses/${encodeURIComponent(course.categoryName)}/${course.courseId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 동적 공지사항 상세 페이지
  const noticeList = await fetchNotices({ page: 0, size: 100 });
  const noticePages: MetadataRoute.Sitemap = noticeList.items.map((notice) => ({
    url: `${BASE_URL}/notice/${notice.noticeId}`,
    lastModified: new Date(notice.createdDate),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...coursePages, ...noticePages];
}
