import {
  ApprovedCourse,
  InstructorInProgressCourse,
  PrivateCourse,
  InstructorDashboardSummary,
  InstructorSalesStatistics,
  InstructorStudentStatistics,
  InstructorCompletionRateStatistics,
} from '@/features/user/mycourses-instructor/types';
import { InstructorProfile } from '@/features/mypage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 강사 프로필 조회 (마이페이지 > 강사 프로필)
export async function fetchInstructorProfile(
  userId: number,
  accessToken: string,
): Promise<InstructorProfile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members/${userId}/instructor-profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function buildYearMonthQuery(year?: number, month?: number): string {
  const query = new URLSearchParams();
  if (year) query.set('year', String(year));
  if (month) query.set('month', String(month));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

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

// 대시보드 - 요약 조회 (상단 카드 3개)
export async function fetchInstructorDashboardSummary(
  accessToken: string,
  userId: string,
  year?: number,
  month?: number,
): Promise<InstructorDashboardSummary | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/instructor/dashboard/summary${buildYearMonthQuery(year, month)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'X-USER-ID': userId },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchInstructorDashboardSummary] status=${res.status} body=${errorBody}`);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchInstructorDashboardSummary] fetch error:', e);
    return null;
  }
}

// 대시보드 - 매출 탭
export async function fetchInstructorSalesStatistics(
  accessToken: string,
  userId: string,
  year?: number,
  month?: number,
): Promise<InstructorSalesStatistics | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/instructor/courses/statistics/sales${buildYearMonthQuery(year, month)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'X-USER-ID': userId },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchInstructorSalesStatistics] status=${res.status} body=${errorBody}`);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchInstructorSalesStatistics] fetch error:', e);
    return null;
  }
}

// 대시보드 - 수강생 수 탭
export async function fetchInstructorStudentStatistics(
  accessToken: string,
  userId: string,
): Promise<InstructorStudentStatistics | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/instructor/courses/statistics/students`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'X-USER-ID': userId },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(`[fetchInstructorStudentStatistics] status=${res.status} body=${errorBody}`);
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchInstructorStudentStatistics] fetch error:', e);
    return null;
  }
}

// 대시보드 - 완강률 탭
export async function fetchInstructorCompletionRateStatistics(
  accessToken: string,
  userId: string,
): Promise<InstructorCompletionRateStatistics | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/instructor/courses/statistics/completion-rate`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'X-USER-ID': userId },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      console.error(
        `[fetchInstructorCompletionRateStatistics] status=${res.status} body=${errorBody}`,
      );
      return null;
    }

    return res.json();
  } catch (e) {
    console.error('[fetchInstructorCompletionRateStatistics] fetch error:', e);
    return null;
  }
}
