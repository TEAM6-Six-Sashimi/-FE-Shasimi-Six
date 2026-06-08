import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // 비로그인 → 로그인 페이지로
  if (!accessToken) {
    if (
      pathname.startsWith('/mycourses-student') ||
      pathname.startsWith('/mypage') ||
      pathname.startsWith('/instructor/application')
    ) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  const role = request.cookies.get('role')?.value;

  // 강사 전용 페이지
  if (
    pathname.startsWith('/mycourses-instructor') ||
    pathname.startsWith('/mypage/instructor-profile')
  ) {
    if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 관리자 전용 페이지
  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/mycourses-student/:path*',
    '/mycourses-instructor/:path*',
    '/mypage/:path*',
    '/instructor/application/:path*',
    '/admin/:path*',
  ],
};
