import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';
import { extractFileKey } from '@/lib/file-url';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  try {
    await fetchUserMeStrict(accessToken);
  } catch (error) {
    if (error instanceof UserMeAuthError) {
      const authMessage = await handleAuthErrorResponse(error.response);
      if (authMessage) return NextResponse.json({ error: authMessage }, { status: 401 });
    }
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const rawKey = req.nextUrl.searchParams.get('key');
  if (!rawKey) {
    return NextResponse.json({ error: 'key가 필요합니다.' }, { status: 400 });
  }

  const key = extractFileKey(rawKey);

  const res = await fetch(`${API_BASE_URL}/files/download?key=${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    console.error(`[files/download] status=${res.status} body=${errorBody} key=${key}`);
    return NextResponse.json({ error: '파일을 불러오지 못했습니다.' }, { status: res.status });
  }

  const blob = await res.blob();
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
  const contentDisposition = res.headers.get('content-disposition');

  // 백엔드가 파일명을 안 내려주면 key의 마지막 경로 조각을 파일명으로 사용
  const fallbackFilename = key.split('/').pop() || 'download';

  return new NextResponse(blob, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition ?? `attachment; filename="${fallbackFilename}"`,
    },
  });
}