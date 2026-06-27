import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchUserMe } from '@/services/user.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? '';

  const user = await fetchUserMe(accessToken);
  if (!user || user.role === 'GUEST') {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('image') as File;

  const newFormData = new FormData();
  newFormData.append('image', file);

  const res = await fetch(`${API_BASE_URL}/instructor/files/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-USER-ID': String(user.id),
    },
    body: newFormData,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error('upload error:', errorBody);
    return NextResponse.json({ error: '업로드에 실패했습니다.' }, { status: res.status });
  }

  const data = await res.json();

  // 디버그: 백엔드가 실제로 내려주는 원본 응답을 그대로 확인 (확인 후 삭제 가능)
  console.log('[instructor/files/upload] raw response =', JSON.stringify(data));

  return NextResponse.json({ url: data.url });
}