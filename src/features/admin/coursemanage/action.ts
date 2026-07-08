'use server';

import { cookies } from 'next/headers';
import { CreateCategoryRequest, RejectReasonCategory } from './type';
import {
  approveCourse,
  fetchCourseRejectReasons,
  rejectCourse,
} from '@/services/admin.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 강의 승인/반려
export async function approveCourseAction(
  courseId: number,
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value ?? '';

    await approveCourse(accessToken, courseId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '승인 처리에 실패했습니다.',
    };
  }
}

export async function fetchCourseRejectReasonsAction(): Promise<RejectReasonCategory[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  return fetchCourseRejectReasons(accessToken);
}

export async function rejectCourseAction(
  courseId: number,
  category: string,
  detail: string,
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value ?? '';

    await rejectCourse(accessToken, courseId, { category, detail });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '반려 처리에 실패했습니다.',
    };
  }
}

// 카테고리 CRUD
type AdminCategoryActionResult =
  | { success: true }
  | { success: false; message: string; code?: string };

export async function createAdminCategory(
  accessToken: string,
  body: CreateCategoryRequest,
): Promise<AdminCategoryActionResult> {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let code: string | undefined;
    let message = '카테고리 등록 실패';

    try {
      const errorBody = await response.json();
      code = errorBody.errorCode ?? errorBody.code;
      message = errorBody.message ?? message;
    } catch {
      // 본문이 JSON이 아닌 경우 무시
    }

    if (code === 'CATEGORY_001') {
      return { success: false, message: '이미 존재하는 세부 카테고리명입니다.', code };
    }
    if (code === 'COMMON_001') {
      return { success: false, message: '카테고리명을 모두 입력해주세요.', code };
    }
    if (code === 'AUTH_001' || code === 'AUTH_002') {
      return { success: false, message: '관리자 권한이 없습니다.', code };
    }

    return { success: false, message, code };
  }

  return { success: true };
}

export async function updateAdminCategory(
  accessToken: string,
  categoryId: number,
  body: { subCategory: string },
): Promise<AdminCategoryActionResult> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let code: string | undefined;
    let message = '카테고리 수정 실패';

    try {
      const errorBody = await response.json();
      code = errorBody.errorCode ?? errorBody.code;
      message = errorBody.message ?? message;
    } catch {}

    return { success: false, message, code };
  }

  return { success: true };
}

export async function deleteAdminCategory(
  accessToken: string,
  categoryId: number,
): Promise<AdminCategoryActionResult> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    let message = '카테고리 삭제 실패';

    try {
      const errorBody = await response.json();
      message = errorBody.message ?? message;
    } catch {}

    return { success: false, message };
  }

  return { success: true };
}
