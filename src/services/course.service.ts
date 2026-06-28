import { CourseFromAPI } from '@/features/user/courses/types';
import { StudentCourse } from '@/features/user/mycourses-student/types';
import { CourseDetailFromAPI, PaymentInfo } from '@/features/user/courses/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 강의 목록 조회
export async function fetchCourses(
  categoryName: string,
  subCategory?: string,
): Promise<CourseFromAPI[]> {
  try {
    const params = new URLSearchParams({ categoryName });
    if (subCategory) params.set('categoryId', subCategory);

    const res = await fetch(`${API_BASE_URL}/api/courses?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data)
      ? data.filter((item) => typeof item === 'object' && item !== null && 'title' in item)
      : [];
  } catch {
    return [];
  }
}

// 강의 상세 조회 (viewerType 기반 통합 API: PUBLIC/ENROLLED/OWNER/ADMIN 분기)
export async function fetchCourseDetail(
  courseId: string,
  accessToken?: string,
): Promise<CourseDetailFromAPI | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// 수강 여부 조회 (이어보기 진입 시 lastSessionId 등 결제/진행 정보가 필요할 때 보조로 사용)
export async function fetchPaymentInfo(
  courseId: string,
  accessToken: string,
): Promise<PaymentInfo | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/payments?courseId=${courseId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null; // 미수강 null
  }
}

// 수강생 내 강의 목록
export async function fetchStudentCourses(
  accessToken: string,
  userId: string,
): Promise<StudentCourse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/student/courses`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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

// NOTE: 강의 상세 + 진행률 조회는 더 이상 /student/courses/{courseId}를 쓰지 않고,
// fetchCourseDetail(/api/courses/{courseId})의 viewerType=ENROLLED 분기로 통합됨.
// 기존 fetchStudentCourseDetail은 제거. 상세 페이지 라우팅도 /courses/{courseId} 등
// 통합 상세 페이지 경로로 연결해야 함.