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

  if (!profileImage) {
    return NextResponse.json({ error: '프로필 사진은 필수입니다.' }, { status: 400 });
  }
  if (!resume) {
    return NextResponse.json({ error: '이력서는 필수입니다.' }, { status: 400 });
  }
  if (certFiles.length === 0) {
    return NextResponse.json({ error: '자격증을 1개 이상 첨부해주세요.' }, { status: 400 });
  }

  // 백엔드 명세: bio, motivationLetter, categoryId, portfolioUrl은 query parameter
  const bio = (formData.get('introduction') as string) ?? '';
  const motivationLetter = (formData.get('motivation') as string) ?? '';
  const categoryId = (formData.get('categoryId') as string) ?? '';
  const portfolioUrl = (formData.get('portfolioUrl') as string) ?? '';

  const queryParams = new URLSearchParams({
    bio,
    motivationLetter,
    categoryId,
    portfolioUrl,
  });

  // 백엔드 명세: profileImage, certificateFiles, resumeFile은 request body(multipart)
  const newFormData = new FormData();
  newFormData.append('profileImage', profileImage);
  newFormData.append('resumeFile', resume);
  certFiles.forEach((file) => {
    newFormData.append('certificateFiles', file);
  });

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/members/${user.id}/instructor-apply?${queryParams.toString()}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: newFormData,
      },
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('instructor-apply error:', errorBody);

      let message = '강사 지원에 실패했습니다.';
      if (res.status === 400) {
        message = '입력값을 확인해주세요. 이미 지원한 내역이 있거나 서류 검증에 실패했을 수 있습니다.';
      } else if (res.status === 403) {
        message = '본인 계정으로만 지원할 수 있습니다.';
      }

      return NextResponse.json({ error: message }, { status: res.status });
    }

    // 204 No Content 응답
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('instructor-apply request failed:', error);
    return NextResponse.json({ error: '강사 지원에 실패했습니다.' }, { status: 502 });
  }
}