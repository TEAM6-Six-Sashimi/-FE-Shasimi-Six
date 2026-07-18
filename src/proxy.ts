import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = [
  '/mycourses-student',
  '/mycourses-instructor',
  '/mypage',
  '/instructor-application',
  '/admin',
  '/payments',
  '/cart',
];

// 로그인 페이지 자체와 점검 안내 페이지는 점검모드 리다이렉트 대상에서 제외
// (안 그러면 무한 리다이렉트 or 점검 중 로그인이 안 됨)
const MAINTENANCE_EXCLUDED_PATHS = ['/maintenance', '/auth/login'];

// prefix가 실제 경로 세그먼트 경계에서 끝나는지까지 확인한다.
// 단순 pathname.startsWith(prefix)만 쓰면 '/mypage-public'처럼 이름만 겹치는
// 전혀 다른 경로까지 같이 매치돼버린다.
function matchesPath(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

let maintenanceCache: { checkedAt: number; enabled: boolean; message: string } = {
  checkedAt: 0,
  enabled: false,
  message: '',
};
const MAINTENANCE_CACHE_TTL_MS = 5000; // 백엔드 Cache-Control max-age와 맞추기
const MAINTENANCE_CHECK_TIMEOUT_MS = 1500; // 이 요청은 거의 모든 경로에서 매번 걸리므로 짧게 끊어야 함

async function checkMaintenance(): Promise<{ enabled: boolean; message: string }> {
  const now = Date.now();
  if (now - maintenanceCache.checkedAt < MAINTENANCE_CACHE_TTL_MS) return maintenanceCache;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/status`, {
      signal: AbortSignal.timeout(MAINTENANCE_CHECK_TIMEOUT_MS),
    });
    const data = await res.json();
    maintenanceCache = { checkedAt: now, enabled: data.enabled, message: data.message };
  } catch {
    // fail-open: 상태 조회 자체가 실패하거나(네트워크 오류) 타임아웃이 나면 평소대로 통과
    // (타임아웃도 이 catch에서 함께 처리됨 - AbortSignal.timeout()이 abort하면 fetch가 reject됨)
    maintenanceCache = { checkedAt: now, enabled: false, message: '' };
  }

  return maintenanceCache;
}

async function verifyRole(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.role ?? null;
  } catch {
    // fail-closed: 점검모드 체크와 반대로, 검증 자체가 실패하면 "권한 없음"으로 취급한다.
    // (여기서 fail-open으로 하면 백엔드가 잠깐 느려지기만 해도 권한 체크가 그냥 뚫려버린다)
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = request.cookies.get('role')?.value; // 점검모드 ADMIN 예외 판단에만 사용 (아래 설명 참고)

  // 1) 점검모드 체크 — 전체 경로 대상, ADMIN·예외 경로·API 라우트는 건너뜀
  // (/api/**는 fetch()로 JSON 응답을 기대하고 호출되므로, HTML 페이지로
  // 리다이렉트해버리면 호출부의 res.json()이 그대로 깨진다)
  const isApiPath = matchesPath(pathname, '/api');
  if (role !== 'ADMIN' && !isApiPath && !MAINTENANCE_EXCLUDED_PATHS.includes(pathname)) {
    const { enabled } = await checkMaintenance();
    if (enabled) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }

  // 2) 기존 로그인/권한 체크 — matcher가 아니라 여기서 "보호된 경로인지" 직접 판단
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => matchesPath(pathname, prefix));
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 강사/관리자 전용 경로는 role 쿠키 대신, 백엔드가 검증한 진짜 role로 판단한다.
  const needsVerifiedRole =
    matchesPath(pathname, '/mycourses-instructor') ||
    matchesPath(pathname, '/mypage/instructor-profile') ||
    matchesPath(pathname, '/admin');

  if (needsVerifiedRole) {
    const verifiedRole = await verifyRole(accessToken);

    if (
      (matchesPath(pathname, '/mycourses-instructor') ||
        matchesPath(pathname, '/mypage/instructor-profile')) &&
      verifiedRole !== 'INSTRUCTOR' &&
      verifiedRole !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (matchesPath(pathname, '/admin') && verifiedRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};
