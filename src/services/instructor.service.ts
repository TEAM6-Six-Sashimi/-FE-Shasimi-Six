import { ApprovedCourse } from '@/features/user/mycourses-instructor/types';
import { InstructorInProgressCourse } from '@/features/user/mycourses-instructor/types';

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
