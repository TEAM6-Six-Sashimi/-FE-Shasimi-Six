import {
  AdminCategory,
  AdminPrivateCourse,
  RejectedCourse,
  RejectReasonCategory,
} from '@/features/admin/coursemanage/type';
import { AuthSessionError, handleAuthErrorResponse } from '@/features/auth/auth-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 강의 관리 - 승인된 전체 강의
export async function fetchAdminCourses(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/courses`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.log('fetchAdminCourses error:', errorBody);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (e) {
    return [];
  }
}

// 강의 관리 - 승인 대기 강의
export async function fetchAdminPendingCourses(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/courses/pending`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// 강의 승인 처리
export async function approveCourse(accessToken: string, courseId: number) {
  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) throw new AuthSessionError(authMessage);

    let message = '승인 처리에 실패했습니다.';
    try {
      const errorBody = await res.json();
      message = errorBody.message || message;
    } catch {
      // JSON이 아니면 기본 메시지 사용
    }
    throw new Error(message);
  }
}

// 강의 반려 사유 카테고리 조회 (호출부에서 이미 try-catch로 실패를 직접 처리함)
export async function fetchCourseRejectReasons(
  accessToken: string,
): Promise<RejectReasonCategory[]> {
  const res = await fetch(`${API_BASE_URL}/admin/courses/reject-reasons`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    console.error(`[fetchCourseRejectReasons] status=${res.status} body=${errorBody}`);
    throw new Error('반려 사유 카테고리를 불러오지 못했습니다.');
  }

  return res.json();
}

// 강의 반려 처리 (category 코드 + 상세 사유)
export async function rejectCourse(
  accessToken: string,
  courseId: number,
  body: { category: string; detail: string },
) {
  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) throw new AuthSessionError(authMessage);

    let message = '반려 처리에 실패했습니다.';
    try {
      const errorBody = await res.json();
      message = errorBody.message || message;
    } catch {
      // JSON이 아니면 기본 메시지 사용
    }
    throw new Error(message);
  }
}

// 강의 반려 이력 조회
export async function fetchAdminRejectedCourses(accessToken: string): Promise<RejectedCourse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/courses/rejected`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminRejectedCourses] status=${res.status} body=${errorBody}`);
      return [];
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminRejectedCourses] fetch error:', e);
    return [];
  }
}

// 강의 관리 - 비공개된 강의
type RawAdminPrivateCourse = Omit<AdminPrivateCourse, 'privatedAt'>;

export async function fetchAdminPrivateCourses(accessToken: string): Promise<AdminPrivateCourse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/courses/closed`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminPrivateCourses] status=${res.status} body=${errorBody}`);
      return [];
    }

    const data: RawAdminPrivateCourse[] = await res.json();

    return data.map((course) => {
      const approvedAt = new Date(course.approvedAt);

      const privateDate = new Date(approvedAt);
      privateDate.setFullYear(privateDate.getFullYear() + 2);

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
      };

      return {
        ...course,
        approvedAt: formatDate(approvedAt),
        privatedAt: formatDate(privateDate),
      };
    });
  } catch (e) {
    console.error('[fetchAdminPrivateCourses]', e);
    return [];
  }
}

// 강의 관리 - 카테고리 관리
export async function fetchAdminCategories(accessToken: string): Promise<AdminCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(`[fetchAdminCategories] status=${response.status} body=${errorBody}`);
      return [];
    }

    return response.json();
  } catch (e) {
    console.error('[fetchAdminCategories] fetch error:', e);
    return [];
  }
}
