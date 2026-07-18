import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 강사 지원자 자격증 진위확인 명단 제출 + 엑셀 다운로드 (관리자 전용)
// 백엔드가 이 호출 자체를 "제출 처리"로 간주하므로, 다운로드가 곧 제출임에 유의
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  let user;
  try {
    user = await fetchUserMeStrict(accessToken);
  } catch (error) {
    if (error instanceof UserMeAuthError) {
      const authMessage = await handleAuthErrorResponse(error.response);
      if (authMessage) return NextResponse.json({ error: authMessage }, { status: 401 });
    }
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
  }

  const applicationIds = req.nextUrl.searchParams.get('applicationIds');
  if (!applicationIds) {
    return NextResponse.json({ error: '제출할 지원자를 선택해주세요.' }, { status: 400 });
  }

  const res = await fetch(
    `${API_BASE_URL}/admin/verification/excel?applicationIds=${encodeURIComponent(applicationIds)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!res.ok) {
    const authMessage = await handleAuthErrorResponse(res);
    if (authMessage) return NextResponse.json({ error: authMessage }, { status: 401 });

    const errorBody = await res.text().catch(() => '');
    console.error(`[admin/verification/excel] status=${res.status} body=${errorBody}`);
    return NextResponse.json(
      { error: '진위확인 명단 제출에 실패했습니다.' },
      { status: res.status },
    );
  }

  const blob = await res.blob();
  const contentType =
    res.headers.get('content-type') ??
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const contentDisposition =
    res.headers.get('content-disposition') ?? 'attachment; filename="verification.xlsx"';

  return new NextResponse(blob, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
    },
  });
}
