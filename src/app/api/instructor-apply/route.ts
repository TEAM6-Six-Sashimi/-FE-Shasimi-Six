import { fetchUserMeStrict, UserMeAuthError } from '@/services/user.service';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
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

      // 백엔드가 구조화된 에러(코드/메시지)를 내려주면 그걸 우선 사용하고,
      // 없으면 상태 코드 기반의 안내 문구로 대체
      const parsed = (() => {
        try {
          return JSON.parse(errorBody);
        } catch {
          return null;
        }
      })();
      const backendMessage: string | undefined = parsed?.message || parsed?.error;
      const backendCode: string | undefined = parsed?.errorCode || parsed?.code;

      // 점검모드(503 + COMMON_900) - 다른 500대 오류와 섞이지 않도록 가장 먼저 분기
      if (res.status === 503 && backendCode === 'COMMON_900') {
        return NextResponse.json(
          { error: backendMessage ?? '점검 중입니다.', maintenance: true },
          { status: 503 },
        );
      }

      const alreadyApplied =
        backendCode === 'INSTRUCTOR_APPLICATION_DUPLICATE' ||
        /이미\s*지원/.test(backendMessage ?? '') ||
        /이미\s*지원/.test(errorBody);

      // COMMON_999 등 백엔드 내부 오류 코드는 사용자에게 그대로 보여줘도 도움이 안 되므로
      // 재시도를 유도하는 안내 문구로 대체
      const isGenericServerError = backendCode === 'COMMON_999' || res.status >= 500;

      let message = backendMessage || '강사 지원에 실패했습니다.';
      if (isGenericServerError) {
        message =
          '일시적인 오류로 지원 접수에 실패했습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요.';
      } else if (!backendMessage) {
        if (alreadyApplied) {
          message = '이미 처리 중인 지원 내역이 있습니다.';
        } else if (res.status === 400) {
          message = '서류 검증에 실패했습니다. 첨부한 파일과 입력 내용을 다시 확인해주세요.';
        } else if (res.status === 403) {
          message = '본인 계정으로만 지원할 수 있습니다.';
        }
      }

      return NextResponse.json({ error: message, alreadyApplied }, { status: res.status });
    }

    // 204 No Content 응답
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('instructor-apply request failed:', error);
    return NextResponse.json({ error: '강사 지원에 실패했습니다.' }, { status: 502 });
  }
}