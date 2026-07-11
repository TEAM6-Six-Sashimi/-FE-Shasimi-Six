'use server';

import { cookies } from 'next/headers';
import { ReviewReport, ReviewReportDetail } from './types';
import { AuthSessionError, handleAuthErrorResponse } from '@/features/auth/auth-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ReportActionResult = { success: true } | { success: false; message: string; authError?: true };

export async function fetchReviewReportsAction(): Promise<ReviewReport[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/admin/reviews/reports`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) return [];
  return res.json();
}

export async function fetchReviewReportDetailAction(
  reportId: number,
): Promise<ReviewReportDetail | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const res = await fetch(`${API_BASE_URL}/admin/reviews/reports/${reportId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}

// 신고된 수강평 삭제 처리
export async function deleteReportedReviewAction(reportId: number): Promise<ReportActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value ?? '';

    const res = await fetch(`${API_BASE_URL}/admin/reviews/reports/${reportId}/delete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      throw new Error('삭제 처리에 실패했습니다.');
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '삭제 처리에 실패했습니다.',
      authError: error instanceof AuthSessionError || undefined,
    };
  }
}

// 신고된 수강평 반려 처리 (수강평 그대로 유지)
export async function rejectReportedReviewAction(reportId: number): Promise<ReportActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value ?? '';

    const res = await fetch(`${API_BASE_URL}/admin/reviews/reports/${reportId}/reject`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      throw new Error('반려 처리에 실패했습니다.');
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '반려 처리에 실패했습니다.',
      authError: error instanceof AuthSessionError || undefined,
    };
  }
}
