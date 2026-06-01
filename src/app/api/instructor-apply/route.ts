import { fetchUserMe } from '@/services/user.service';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  const newFormData = new FormData();
  newFormData.append('bio', formData.get('bio') as string);
  newFormData.append('portfolioUrl', formData.get('portfolioUrl') as string);
  files.forEach((file) => {
    newFormData.append('files', file); // file → files
  });

  const res = await fetch(`${API_BASE_URL}/api/members/${user.id}/instructor-apply`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: newFormData,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('instructor-apply error:', errorBody);
    return NextResponse.json({ error: '강사 지원에 실패했습니다.' }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}
