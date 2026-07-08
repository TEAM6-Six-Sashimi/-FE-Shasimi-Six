import { MyInstructorApplication, MyInstructorApplicationDetail } from '@/features/mypage/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 나의 강사 지원 내역 목록 조회
export async function fetchMyInstructorApplications(
  userId: number,
  accessToken: string,
): Promise<MyInstructorApplication[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/members/${userId}/instructor-applications`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// 나의 강사 지원 상세 (반려 사유 포함) 조회
export async function fetchMyInstructorApplicationDetail(
  userId: number,
  applicationId: number,
  accessToken: string,
): Promise<MyInstructorApplicationDetail | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/members/${userId}/instructor-applications/${applicationId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
