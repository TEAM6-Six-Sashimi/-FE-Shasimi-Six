'use server';

import { cookies } from 'next/headers';
import { AdminApiError, CreateCategoryRequest } from './type';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 강의 승인/반려
export async function approveCourseAction(courseId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/approve`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error('승인 처리에 실패했습니다.');
}

export async function rejectCourseAction(courseId: number, rejectReason: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rejectReason }),
  });

  if (!res.ok) throw new Error('반려 처리에 실패했습니다.');
}

// 비공개 강의 목록 조회
export async function getClosedCoursesAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/admin/courses/closed`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('비공개 강의 목록 조회에 실패했습니다.');
  }

  return res.json();
}

// 카테고리 CRUD
export async function createAdminCategory(accessToken: string, body: CreateCategoryRequest) {
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
      throw new AdminApiError('이미 존재하는 세부 카테고리명입니다.', code);
    }
    if (code === 'COMMON_001') {
      throw new AdminApiError('카테고리명을 모두 입력해주세요.', code);
    }
    if (code === 'AUTH_001' || code === 'AUTH_002') {
      throw new AdminApiError('관리자 권한이 없습니다.', code);
    }

    throw new AdminApiError(message, code);
  }
}

export async function updateAdminCategory(
  accessToken: string,
  categoryId: number,
  body: { subCategory: string },
) {
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

    throw new AdminApiError(message, code);
  }
}

export async function deleteAdminCategory(accessToken: string, categoryId: number) {
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

    throw new AdminApiError(message);
  }
}
