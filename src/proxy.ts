import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // 비로그인 → 로그인 페이지로 (원래 가려던 경로를 redirect 파라미터로 유지)
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
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
    '/instructor-application/:path*',
    '/admin/:path*',
    '/payments/:path*',
    '/cart/:path*',
  ],
};
