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
const MAINTENANCE_EXCLUDED_PATHS = ['/maintenance', '/auth/login'];

// prefix가 실제 경로 세그먼트 경계에서 끝나는지까지 확인한다.
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
const MAINTENANCE_RETRY_DELAY_MS = 400; // 순간적인 지연과 완전한 다운을 구분하기 위한 재시도 전 대기

async function fetchMaintenanceStatus(): Promise<{ enabled: boolean; message: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/status`, {
    signal: AbortSignal.timeout(MAINTENANCE_CHECK_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`maintenance status check failed: ${res.status}`);
  const data = await res.json();
  return { enabled: data.enabled, message: data.message };
}

async function checkMaintenance(): Promise<{ enabled: boolean; message: string }> {
  const now = Date.now();
  if (now - maintenanceCache.checkedAt < MAINTENANCE_CACHE_TTL_MS) return maintenanceCache;

  try {
    maintenanceCache = { checkedAt: now, ...(await fetchMaintenanceStatus()) };
    return maintenanceCache;
  } catch {
    // 1차 실패 - 네트워크 순간 지연일 수 있으니 짧게 대기 후 한 번 더 시도
  }

  await new Promise((resolve) => setTimeout(resolve, MAINTENANCE_RETRY_DELAY_MS));

  try {
    maintenanceCache = { checkedAt: now, ...(await fetchMaintenanceStatus()) };
  } catch {
    // 재시도까지 실패하면 배포/장애 등으로 백엔드가 완전히 다운된 것으로 보고 fail-closed 처리
    maintenanceCache = {
      checkedAt: now,
      enabled: true,
      message: '서버 점검 또는 일시적인 장애로 서비스 이용이 어렵습니다. 잠시 후 다시 시도해주세요.',
    };
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
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // 이 요청 안에서 role 검증이 여러 번 필요해도(점검모드 ADMIN 예외 + 강사/관리자 경로 체크)
  // verifyRole()은 최대 한 번만 호출되도록 메모이즈한다.
  let verifiedRole: string | null | undefined;
  const getVerifiedRole = async () => {
    if (verifiedRole === undefined) {
      verifiedRole = accessToken ? await verifyRole(accessToken) : null;
    }
    return verifiedRole;
  };

  // 1) 점검모드 체크 — 전체 경로 대상, 예외 경로·API 라우트는 건너뜀
  const isApiPath = matchesPath(pathname, '/api');
  if (!isApiPath && !MAINTENANCE_EXCLUDED_PATHS.includes(pathname)) {
    const { enabled } = await checkMaintenance();
    if (enabled) {
      const role = await getVerifiedRole();
      if (role !== 'ADMIN') {
        // 점검이 끝나면 홈이 아니라 원래 가려던 곳으로 돌아갈 수 있도록 경로를 남겨둔다.
        const maintenanceUrl = new URL('/maintenance', request.url);
        maintenanceUrl.searchParams.set('redirect', `${pathname}${search}`);
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  }

  // 2) 기존 로그인/권한 체크 — matcher가 아니라 여기서 "보호된 경로인지" 직접 판단
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => matchesPath(pathname, prefix));
  if (!isProtectedPath) {
    return NextResponse.next();
  }

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
    const role = await getVerifiedRole();

    if (
      (matchesPath(pathname, '/mycourses-instructor') ||
        matchesPath(pathname, '/mypage/instructor-profile')) &&
      role !== 'INSTRUCTOR' &&
      role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (matchesPath(pathname, '/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
};
