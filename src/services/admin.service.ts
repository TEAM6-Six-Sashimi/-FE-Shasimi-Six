import { AdminCategory } from '@/features/admin/coursemanage/type';
import {
  AdminUser,
  AdminUserDetail,
  InstructorApplication,
  InstructorApplicationDetail,
} from '@/features/admin/usermanage/types';

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


// 회원 관리 - 강사 승인
export async function fetchInstructorApplications(
  accessToken: string,
): Promise<InstructorApplication[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members/instructor-applications/pending`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  } catch {
    return [];
  }
}

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
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? data;
  } catch {
    return null;
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


// 강의 관리 - 승인/반려
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

export async function fetchAdminRejectedCourses(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/courses/rejected`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}


// 강의 관리 - 카테고리 관리
export async function fetchAdminCategories(
  accessToken: string,
): Promise<AdminCategory[]> {
  const response = await fetch(
    `${API_BASE_URL}/admin/categories`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('카테고리 조회 실패');
  }

  return response.json();
}
