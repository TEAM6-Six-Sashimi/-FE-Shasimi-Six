import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchUserMe } from '@/services/user.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const res = await fetch(`${API_BASE_URL}/api/members/resume-template`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    console.error(`[resume-template] status=${res.status} body=${errorBody}`);
    return NextResponse.json({ error: '이력서 양식을 불러오지 못했습니다.' }, { status: res.status });
  }

  const blob = await res.blob();
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
  const contentDisposition =
    res.headers.get('content-disposition') ?? 'attachment; filename="resume-template.docx"';

  return new NextResponse(blob, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
    },
  });
}