'use server';

import { cookies } from 'next/headers';
import { InstructorApplicationDetail } from './types';
import {
  fetchInstructorApplicationDetail,
  fetchInstructorApplications,
  fetchRejectedInstructorApplications,
  approveInstructor,
  rejectInstructor,
} from '@/services/admin.service';

type InstructorActionResult = { success: true } | { success: false; message: string };

export async function approveInstructorAction(
  applicationId: number,
): Promise<InstructorActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value ?? '';

    await approveInstructor(accessToken, applicationId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '승인 처리에 실패했습니다.',
    };
  }
}

export async function rejectInstructorAction(
  applicationId: number,
  rejectionCategory: string,
  rejectionReason: string,
): Promise<InstructorActionResult> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value ?? '';

    await rejectInstructor(accessToken, applicationId, { rejectionCategory, rejectionReason });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : '반려 처리에 실패했습니다.',
    };
  }
}

// 상세 조회 + 목록(대기/반려 이력)에서 이름·아이디·이메일을 보강
export async function getApplicationDetailAction(
  applicationId: number,
): Promise<InstructorApplicationDetail | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const detail = await fetchInstructorApplicationDetail(accessToken, applicationId);

  if (!detail) return null;

  // 상세 응답에 name/loginId/email이 없으므로 목록에서 찾아 보강
  const [pending, rejected] = await Promise.all([
    fetchInstructorApplications(accessToken),
    fetchRejectedInstructorApplications(accessToken),
  ]);

  const fromPending = pending.find((p) => p.applicationId === applicationId);
  const fromRejected = rejected.find((r) => r.applicationId === applicationId);
  const matched = fromPending ?? fromRejected;

  const merged: InstructorApplicationDetail = {
    ...detail,
    mainCareers: detail.mainCareers ?? [],
    certifications: detail.certifications ?? [],
    name: matched?.name,
    loginId: matched?.loginId,
    email: matched?.email,
    categoryName: fromPending?.categoryName ?? detail.categoryName,
  };

  return merged;
}
