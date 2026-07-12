'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { AuthSessionError, handleAuthErrorResponse } from '@/features/auth/auth-error';
import type { UserMe } from '@/features/auth/types';
import type { CreateCourseRequest } from '@/features/user/mycourses-instructor/types';
import type { UpdateCourseRequest } from '@/features/user/mycourses-instructor/types';
import type {
  InstructorDashboardSummary,
  InstructorSalesStatistics,
  InstructorStudentStatistics,
  InstructorCompletionRateStatistics,
} from '@/features/user/mycourses-instructor/types';
import {
  fetchInstructorDashboardSummary,
  fetchInstructorSalesStatistics,
  fetchInstructorStudentStatistics,
  fetchInstructorCompletionRateStatistics,
} from '@/services/instructor.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type CourseActionResult = { success: true } | { success: false; message: string; authError?: true };

async function getAuthOrThrow(): Promise<{ accessToken: string; user: UserMe }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  try {
    const user = await fetchUserMeStrict(accessToken);
    return { accessToken, user };
  } catch (error) {
    if (error instanceof UserMeAuthError) {
      const authMessage = await handleAuthErrorResponse(error.response);
      if (authMessage) throw new AuthSessionError(authMessage);
    }
    throw new Error('인증이 필요합니다.');
  }
}

// 신규 강의 등록
export async function createCourseAction(
  payload: CreateCourseRequest,
): Promise<CourseActionResult> {
  try {
    const { accessToken, user } = await getAuthOrThrow();

    const res = await fetch(`${API_BASE_URL}/instructor/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-USER-ID': String(user.id),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) throw new AuthSessionError(authMessage);

      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || '강의 등록에 실패했습니다.');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '강의 등록에 실패했습니다.',
      authError: error instanceof AuthSessionError || undefined,
    };
  }
}

// 보관/반려 강의 수정
export async function updateCourseAction(
  courseId: number,
  payload: UpdateCourseRequest,
): Promise<CourseActionResult> {
  try {
    const { accessToken, user } = await getAuthOrThrow();

    const res = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-USER-ID': String(user.id),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) throw new AuthSessionError(authMessage);

      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.message || '강의 수정에 실패했습니다.');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '강의 수정에 실패했습니다.',
      authError: error instanceof AuthSessionError || undefined,
    };
  }
}

// 보관/반려 강의 삭제
export async function deleteCourseAction(courseId: number): Promise<CourseActionResult> {
  try {
    const { accessToken, user } = await getAuthOrThrow();

    const res = await fetch(`${API_BASE_URL}/instructor/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-USER-ID': String(user.id),
      },
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      throw new Error('삭제 처리에 실패했습니다.');
    }

    revalidatePath('/mycourses-instructor');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '삭제 처리에 실패했습니다.',
      authError: error instanceof AuthSessionError || undefined,
    };
  }
}

// 대시보드 - 요약 카드
export async function fetchDashboardSummaryAction(
  year?: number,
  month?: number,
): Promise<InstructorDashboardSummary | null> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    return fetchInstructorDashboardSummary(accessToken, String(user.id), year, month);
  } catch {
    return null;
  }
}

// 대시보드 - 매출 통계 탭
export async function fetchSalesStatisticsAction(
  year?: number,
  month?: number,
): Promise<InstructorSalesStatistics | null> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    return fetchInstructorSalesStatistics(accessToken, String(user.id), year, month);
  } catch {
    return null;
  }
}

// 대시보드 - 수강생 수 통계 탭
export async function fetchStudentStatisticsAction(): Promise<InstructorStudentStatistics | null> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    return fetchInstructorStudentStatistics(accessToken, String(user.id));
  } catch {
    return null;
  }
}

// 대시보드 - 완강률 통계 탭
export async function fetchCompletionRateStatisticsAction(): Promise<InstructorCompletionRateStatistics | null> {
  try {
    const { accessToken, user } = await getAuthOrThrow();
    return fetchInstructorCompletionRateStatistics(accessToken, String(user.id));
  } catch {
    return null;
  }
}
