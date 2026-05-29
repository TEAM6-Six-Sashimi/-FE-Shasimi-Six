import { InstructorApplication } from "@/features/admin/usermanage/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchInstructorApplications(accessToken: string): Promise<InstructorApplication[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members/instructor-applications/pending`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchAdminCourses(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/courses`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
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

export async function fetchAdminPendingCourses(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/courses/pending`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function approveCourse(accessToken: string, courseId: number) {
  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/approve`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('승인 처리에 실패했습니다.');
}

export async function rejectCourse(accessToken: string, courseId: number, rejectReason: string) {
  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/reject`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rejectReason }),
  });
  if (!res.ok) throw new Error('반려 처리에 실패했습니다.');
}