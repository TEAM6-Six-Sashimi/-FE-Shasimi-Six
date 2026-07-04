import {
  ApprovedCourse,
  InstructorInProgressCourse,
  PrivateCourse,
} from '@/features/user/mycourses-instructor/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApprovedCourses(
  accessToken: string,
  userId: string,
): Promise<ApprovedCourse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/instructor/courses/approved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-USER-ID': userId,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return [];
    }

    const result = await response.json();
    return Array.isArray(result) ? result : (result.data ?? []);
  } catch (e) {
    console.error('fetchApprovedCourses fetch error:', e);
    return [];
  }
}

export async function fetchInProgressCourses(
  accessToken: string,
  userId: string,
): Promise<InstructorInProgressCourse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/instructor/courses/in-progress`, {
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

// 강의 단건 조회 (수정 페이지 초기 데이터 로딩용)
export async function fetchCourseDetail(
  accessToken: string,
  userId: string,
  courseId: number,
): Promise<InstructorInProgressCourse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-USER-ID': userId,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchCourseDetail] status=${res.status} body=${errorBody}`);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchCourseDetail] fetch error:', e);
    return null;
  }
}

// 비공개된 강의 조회
export async function fetchClosedCourses(
  accessToken: string,
  userId: string,
): Promise<PrivateCourse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/instructor/courses/closed`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-USER-ID': userId,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return Array.isArray(result) ? result : (result.data ?? []);
  } catch {
    return [];
  }
}
