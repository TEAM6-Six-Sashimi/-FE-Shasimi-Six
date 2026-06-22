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
  const certFiles = formData.getAll('files') as File[];
  const resume = formData.get('resume') as File | null;
  const profileImage = formData.get('profileImage') as File | null;

  const newFormData = new FormData();
  newFormData.append('introduction', formData.get('introduction') as string);
  newFormData.append('motivation', formData.get('motivation') as string);
  newFormData.append('categoryId', formData.get('categoryId') as string);
  newFormData.append('portfolioUrl', formData.get('portfolioUrl') as string);

  if (profileImage) newFormData.append('profileImage', profileImage);
  if (resume) newFormData.append('resume', resume);
  certFiles.forEach((file) => {
    newFormData.append('files', file);
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
