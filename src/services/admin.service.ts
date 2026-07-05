import {
  AdminUser,
  AdminUserDetail,
  InstructorApplication,
  InstructorApplicationDetail,
  RejectedInstructorApplication,
} from '@/features/admin/usermanage/types';
import {
  AdminCategory,
  AdminPrivateCourse,
  RejectedCourse,
  RejectReasonCategory,
} from '@/features/admin/coursemanage/type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 회원 관리 - 전체 회원 조회
export async function fetchAdminUsers(accessToken: string): Promise<AdminUser[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminUsers] status=${res.status} body=${errorBody}`);
      return [];
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminUsers] fetch error:', e);
    return [];
  }
}

// 회원 관리 - 회원 상세 조회
export async function fetchAdminUserDetail(
  accessToken: string,
  userId: number,
): Promise<AdminUserDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchAdminUserDetail] status=${res.status} body=${errorBody}`);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchAdminUserDetail] fetch error:', e);
    return null;
  }
}

// 강사 승인 대기 목록 조회
export async function fetchInstructorApplications(
  accessToken: string,
): Promise<InstructorApplication[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members/instructor-applications/pending`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(
        `[fetchInstructorApplications] status=${res.status} body=${errorBody} token=${accessToken ? '있음' : '없음(빈 문자열)'}`,
      );
      return [];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : (data.data ?? []);
  } catch (e) {
    console.error('[fetchInstructorApplications] fetch error:', e);
    return [];
  }
}

// 강사 승인 대기 상세 조회
export async function fetchInstructorApplicationDetail(
  accessToken: string,
  applicationId: number,
): Promise<InstructorApplicationDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/members/instructor-applications/${applicationId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );
    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchInstructorApplicationDetail] status=${res.status} body=${errorBody}`);
      return null;
    }
    const data = await res.json();
    return data.data ?? data;
  } catch (e) {
    console.error('[fetchInstructorApplicationDetail] fetch error:', e);
    return null;
  }
}

// 강사 승인 처리
export async function approveInstructor(accessToken: string, applicationId: number) {
  const res = await fetch(
    `${API_BASE_URL}/api/members/instructor-applications/${applicationId}/approve`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!res.ok) {
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

// 강사 반려 처리
export async function rejectInstructor(
  accessToken: string,
  applicationId: number,
  body: { rejectionCategory: string; rejectionReason: string },
) {
  const res = await fetch(
    `${API_BASE_URL}/api/members/instructor-applications/${applicationId}/reject`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
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

// 강사 승인 반려 이력 조회
export async function fetchRejectedInstructorApplications(
  accessToken: string,
): Promise<RejectedInstructorApplication[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members/instructor-applications/rejected`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchRejectedInstructorApplications] status=${res.status} body=${errorBody}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch (e) {
    console.error('[fetchRejectedInstructorApplications] fetch error:', e);
    return [];
  }
}

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

// 강의 반려 사유 카테고리 조회
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
  const res = await fetch(`${API_BASE_URL}/admin/courses/rejected`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    console.error(`[fetchAdminRejectedCourses] status=${res.status} body=${errorBody}`);
    throw new Error('반려된 강의 목록을 불러오지 못했습니다.');
  }

  return res.json();
}

// 강의 관리 - 비공개된 강의
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

    const data = await res.json();

    return data.map((course: any) => {
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
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('카테고리 조회 실패');
  }

  return response.json();
}
