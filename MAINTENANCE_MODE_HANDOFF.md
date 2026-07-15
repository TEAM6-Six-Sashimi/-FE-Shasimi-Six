# 점검모드(서비스 이용 불가) 처리 — 작업 인수인계 문서

이 문서는 다른 대화 세션에서 진행된 논의를 정리한 것입니다. 이 작업을 처음 맡는 사람(또는 AI)이 아래 내용만 보고 바로 작업할 수 있도록, 배경부터 최종 코드까지 전부 담았습니다.

---

## 0. 배경

백엔드에 두 가지 상황이 있습니다.

1. **정기점검**: 팀이 사전에 공지하고, 그 시간에 관리자가 수동으로 "점검모드"를 켭니다.
2. **배포(CI/CD)**: 팀원이 코드를 머지할 때마다 GitHub Actions가 자동으로 배포하는데, 배포 시작 직전에 자동으로 "점검모드"를 켰다가 배포 완료 후 자동으로 끕니다.

이 두 상황은 백엔드 입장에서 완전히 동일한 방식으로 프론트에 신호를 보냅니다. 그래서 프론트는 로직을 하나만 만들면 두 상황을 다 처리할 수 있습니다.

**작업 범위(합의된 스코프)**: "예외 없이 100% 완전 커버"(34개 파일, 115개 fetch 호출부 전부 수정, 2~2.5일)는 하지 않습니다. 대신 아래 절충안으로 진행합니다.

- 페이지 진입/이동 시점은 **미들웨어(`src/proxy.ts`) 한 곳**에서 커버 (거의 모든 시나리오를 이걸로 커버함)
- "이미 화면 켜놓고 쓰다가 점검모드 켜지는" 케이스는 **트래픽 큰 상호작용 8~10곳만** 선별 적용
- 나머지 API 호출 중에 점검모드가 켜지면 그 요청만 그냥 실패로 보일 수 있음 — 이건 받아들이기로 한 트레이드오프임

예상 소요시간: **6~9시간 (하루 이내)**

---

## 1. 백엔드 API 스펙 (확정, 변경 없음)

### 1-1. 점검 상태 조회
```
GET https://api.sixsashimi.com.market-app.org/maintenance/status
```
- 인증 헤더 필요 없음 (누구나 호출 가능)
- 응답:
```json
{ "enabled": true, "message": "새 버전을 배포하고 있습니다. 잠시 후 다시 이용해주세요." }
```
- `enabled: true` → 사이트 전체를 "이용 불가 안내 화면"으로 덮음. `message`를 그대로 표시.
- `enabled: false` → 평소대로 렌더링.
- 백엔드가 `Cache-Control` 헤더를 응답에 추가했지만, **Next.js Middleware(Edge Runtime)에서는 자동으로 활용되지 않습니다** (`next: { revalidate }` 옵션 자체가 Edge Runtime 미지원 — [공식문서](https://nextjs.org/docs/app/api-reference/functions/fetch), [관련 논의](https://github.com/vercel/next.js/discussions/53504)). 그래서 프론트가 직접 인메모리 캐시를 구현합니다 (아래 3장 코드에 포함됨).

### 1-2. 점검모드 중 API 호출 시 공통 응답
점검모드가 켜진 동안 (ADMIN 계정이 아닌) 모든 API 호출은 이렇게 응답합니다:
```
HTTP 503
{
  "status": 503,
  "errorCode": "COMMON_900",
  "message": "새 버전을 배포하고 있습니다. 잠시 후 다시 이용해주세요.",
  "path": "/api/courses",
  "traceId": "..."
}
```
**중요**: 반드시 `errorCode === "COMMON_900"`으로 판단해야 합니다. 단순히 `status === 503`만으로 분기하면 안 됩니다 — 다른 이유의 503과 섞일 수 있습니다.

### 1-3. 참고사항
- ADMIN 세션은 점검모드 중에도 항상 정상 동작 (프론트에서 ADMIN이면 리다이렉트 제외)
- `/auth/login`은 점검모드 중에도 열려있어서 로그인은 성공하지만, 그다음 API 호출에서 503이 옴 → **로그인 페이지 자체는 점검모드 리다이렉트 대상에서 제외해야 함**

---

## 2. 이 코드베이스에 대해 반드시 알아야 할 것

### 2-1. Next.js 버전과 미들웨어 네이밍 (★중요, 흔한 실수 지점)
- `package.json` 기준 **`next: 16.2.6`** 사용 중.
- **Next.js 16부터 미들웨어 파일/함수명이 `middleware` → `proxy`로 바뀌었습니다.** 이 프로젝트는 이미 `src/proxy.ts`에 `export function proxy(request: NextRequest)`로 되어 있습니다. **절대 `export function middleware(...)`로 쓰면 안 됩니다** — Next.js 16이 그 이름을 미들웨어로 인식하지 못해서 아예 동작을 안 합니다.

### 2-2. 순수 fetch, axios 없음
- 이 프로젝트는 axios를 전혀 안 씁니다. 전부 native `fetch()`.
- 중앙 fetch 래퍼(`apiClient.ts` 같은 것)도 없습니다. `src/services/` 아래 21개 서비스 파일이 각자 독립적으로 `fetch()`를 호출합니다 (전체 34개 파일에서 115회 호출).

### 2-3. 서버 컴포넌트에서도 직접 fetch함 (SSR)
- `src/app/(user)/**/page.tsx` 상당수가 서버 컴포넌트로, 렌더링 중에 서비스 함수를 직접 호출해 데이터를 가져옵니다 (예: `courses/[category]/page.tsx`, `ai-analysis/page.tsx`).
- 즉 클라이언트(`useEffect`)만 감시해서는 SSR 중 발생하는 503을 못 잡습니다. 그래서 **미들웨어(요청 단계)에서 거르는 게 핵심**입니다.

### 2-4. 기존에 이미 있는, 그대로 베낄 패턴들
- **`src/components/ui/ToastContext.tsx`** — Context + Provider + `useToast()` 훅 패턴. 새로 만들 `MaintenanceProvider`가 이 구조를 그대로 따라야 합니다.
- **`src/features/auth/auth-error.ts`의 `handleAuthErrorResponse`** — 401(세션 만료)을 감지해서 서비스 함수들이 `{ authError: true, message }`를 리턴하게 하는 기존 컨벤션. 이번 점검모드 처리도 **같은 모양(`maintenance?: true`)으로 맞춰야 합니다.** 아래 예시 참고.

### 2-5. ★★★ 절대 `throw`로 처리하면 안 되는 이유 (이 세션 초반에 실제로 겪은 버그)
- 이 코드베이스는 Next.js Server Action(`'use server'` 액션 파일들)을 광범위하게 사용합니다.
- **Server Action 경계를 넘어 `throw`된 에러의 메시지는 프로덕션 빌드에서 익명화(digest 메시지로 대체)됩니다.** 실제로 로그인 에러 메시지가 프로덕션에서 안 보이던 버그의 원인이 바로 이거였고, 그래서 이 프로젝트는 이후 모든 서비스 함수가 **`throw` 대신 discriminated union 리턴값**(`{success: true, ...} | {success: false, authError?: true, message?: string}`)을 쓰도록 통일했습니다.
- 점검모드 처리도 서비스 파일 안에서 `throw new MaintenanceError(...)` 같은 걸 쓰면 **똑같은 버그가 재발**합니다. 반드시 리턴값 패턴을 따르세요.

---

## 3. 만들 파일 (4개, 최종 수정본)

### 3-1. `src/services/maintenance.service.ts`
```ts
export interface MaintenanceStatus {
  enabled: boolean;
  message: string;
}

export async function fetchMaintenanceStatus(): Promise<MaintenanceStatus> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/status`);
  return res.json();
}
```

### 3-2. `src/components/system/MaintenanceProvider.tsx`
`ToastContext.tsx`와 동일 구조.
```tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchMaintenanceStatus } from '@/services/maintenance.service';
import ServiceUnavailablePage from './ServiceUnavailablePage';

interface MaintenanceContextValue {
  isBlocked: boolean;
  message: string;
  setMaintenance: (blocked: boolean, message?: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextValue | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [message, setMessage] = useState('');

  const setMaintenance = (blocked: boolean, msg = '') => {
    setIsBlocked(blocked);
    setMessage(msg);
  };

  useEffect(() => {
    fetchMaintenanceStatus()
      .then((data) => {
        if (data.enabled) setMaintenance(true, data.message);
      })
      .catch(() => {
        // 이 요청 자체가 실패해도 여기선 무시 (미들웨어가 페이지 단위로 이미 걸러줌)
      });
  }, []);

  if (isBlocked) return <ServiceUnavailablePage message={message} />;

  return (
    <MaintenanceContext.Provider value={{ isBlocked, message, setMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) throw new Error('useMaintenance는 MaintenanceProvider 안에서 사용해야 합니다.');
  return ctx;
}
```

### 3-3. `src/components/system/ServiceUnavailablePage.tsx`
디자인은 자유. 아래는 최소 구현 (이 프로젝트 컬러 팔레트 `#1E2125`/`#6A7282`/`#FF5E5E` 참고해서 다듬어도 됨).
```tsx
'use client';

import { useEffect } from 'react';

export default function ServiceUnavailablePage({ message }: { message: string }) {
  useEffect(() => {
    const timer = setTimeout(() => window.location.reload(), 20000); // 20초 후 자동 새로고침 (선택)
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="text-center px-6">
        <h1 className="mb-2 text-xl font-bold text-[#1E2125]">서비스 이용이 잠시 어렵습니다</h1>
        <p className="text-[#6A7282]">{message}</p>
      </div>
    </div>
  );
}
```

### 3-4. `src/app/maintenance/page.tsx`
미들웨어가 리다이렉트시키는 목적지. 서버 컴포넌트라 고정 문구를 쓰고, 실제 실시간 `message`는 클라이언트 하이드레이션 후 `MaintenanceProvider`가 이어받아 교체합니다(문구가 한 번 바뀌는 건 정상 — 무시해도 되는 사소한 깜빡임).
```tsx
import ServiceUnavailablePage from '@/components/system/ServiceUnavailablePage';

export default function MaintenancePage() {
  return (
    <ServiceUnavailablePage message="현재 서비스 점검/업데이트 중입니다. 잠시 후 다시 이용해주세요." />
  );
}
```

---

## 4. `src/proxy.ts` 수정 (최종본 — 여기가 제일 중요하고 오래 걸림, ~3~4시간)

기존 파일:
```ts
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const role = request.cookies.get('role')?.value;

  if (
    pathname.startsWith('/mycourses-instructor') ||
    pathname.startsWith('/mypage/instructor-profile')
  ) {
    if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

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
```

**주의점**: 지금 matcher는 보호된 경로에만 좁게 걸려있어서, `!accessToken` 체크가 경로 구분 없이(matcher가 이미 걸러줬다는 가정하에) 무조건 실행돼도 문제없었습니다. 그런데 점검모드 체크는 **사이트 전체 경로**에 걸려야 하므로 matcher를 넓혀야 하는데, 그러면 `/`, `/courses/**`, `/ai-analysis`, `/coffee-chat`, `/recommendations` 같은 **비로그인 접근을 일부러 허용하는 페이지들**까지 로그인 강제 리다이렉트에 걸려버립니다. 그래서 "보호된 경로인지" 판단 로직을 matcher에서 함수 본문으로 옮겨야 합니다.

수정본:
```ts
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

let maintenanceCache: { checkedAt: number; enabled: boolean; message: string } = {
  checkedAt: 0,
  enabled: false,
  message: '',
};
const MAINTENANCE_CACHE_TTL_MS = 5000; // 백엔드 Cache-Control max-age와 맞추기

async function checkMaintenance(): Promise<{ enabled: boolean; message: string }> {
  const now = Date.now();
  if (now - maintenanceCache.checkedAt < MAINTENANCE_CACHE_TTL_MS) return maintenanceCache;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/maintenance/status`);
    const data = await res.json();
    maintenanceCache = { checkedAt: now, enabled: data.enabled, message: data.message };
  } catch {
    maintenanceCache = { checkedAt: now, enabled: false, message: '' }; // fail-open: 상태 조회 자체가 실패하면 평소대로 통과
  }

  return maintenanceCache;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const role = request.cookies.get('role')?.value;

  // 1) 점검모드 체크 — 전체 경로 대상, ADMIN과 예외 경로는 건너뜀
  if (role !== 'ADMIN' && !MAINTENANCE_EXCLUDED_PATHS.includes(pathname)) {
    const { enabled } = await checkMaintenance();
    if (enabled) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }

  // 2) 기존 로그인/권한 체크 — matcher가 아니라 여기서 "보호된 경로인지" 직접 판단
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname.startsWith('/mycourses-instructor') ||
    pathname.startsWith('/mypage/instructor-profile')
  ) {
    if (role !== 'INSTRUCTOR' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

**참고**: `maintenanceCache`는 모듈 스코프 변수라 서버리스/엣지 환경에서 인스턴스가 재생성되면 초기화될 수 있습니다. 이 프로젝트가 Docker standalone 배포라 인스턴스가 오래 유지되는 구조라면 문제없을 것으로 예상되나, 실제로 같은 인스턴스에서 5초 이내 반복 요청 시 `/maintenance/status`를 재호출 안 하는지 로그로 확인 권장.

---

## 5. `src/app/layout.tsx` 수정 (★기존 내용 지우지 말고 감싸기)

현재 실제 파일 내용:
```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={cn('font-sans', geist.variable)}>
      <body className="flex-1">
        <ToastProvider>
          <Header />
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
```

`MaintenanceProvider`를 **기존 `ToastProvider`/`Header`/`main`을 감싸는 형태로** 추가합니다 (통째로 갈아치우면 `ToastProvider`랑 `Header`가 사라지니 주의):
```tsx
import { MaintenanceProvider } from '@/components/system/MaintenanceProvider';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={cn('font-sans', geist.variable)}>
      <body className="flex-1">
        <MaintenanceProvider>
          <ToastProvider>
            <Header />
            <main>{children}</main>
          </ToastProvider>
        </MaintenanceProvider>
      </body>
    </html>
  );
}
```

---

## 6. 트래픽 큰 상호작용 8~10곳 (세션 중 점검모드 켜지는 경우, ~2~3시간)

대상 후보 (실제 파일 존재 확인 완료): `payment.service.ts`(결제 시도), `credit.service.ts`(크레딧 충전), `cart.service.ts`(장바구니/결제 진입), `resume.service.ts`(이력서 저장/AI 평가), `instructor-application.service.ts`(강사 신청), `review.service.ts`(리뷰 작성). 최종 대상은 팀에서 실사용 빈도 보고 선정.

**패턴: 기존 `authError` 리턴값 컨벤션과 완전히 동일하게, `maintenance?: true` 필드를 추가합니다. `throw`는 절대 쓰지 마세요 (2-5 항목 참고).**

예시 (`resume.service.ts`의 `updateResume` 기준):
```ts
export type UpdateResumeResult =
  | { success: true }
  | { success: false; authError?: true; maintenance?: true; message?: string };

export async function updateResume(
  accessToken: string,
  resumeId: number,
  payload: ResumePayload,
): Promise<UpdateResumeResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const authMessage = await handleAuthErrorResponse(res);
      if (authMessage) return { success: false, authError: true, message: authMessage };

      if (res.status === 503) {
        const errorBody = await res.json().catch(() => null);
        if (errorBody?.errorCode === 'COMMON_900') {
          return { success: false, maintenance: true, message: errorBody.message };
        }
      }

      return { success: false };
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}
```

그리고 이 함수를 호출하는 **클라이언트 컴포넌트** 쪽(예: `ResumeMain.tsx`의 `handleSave`)에서 `useMaintenance` 훅을 씁니다 (서비스 파일 안에서는 훅을 못 쓰므로 절대 서비스 파일에 `useMaintenance`를 import하지 마세요):
```tsx
import { useMaintenance } from '@/components/system/MaintenanceProvider';

// 컴포넌트 내부
const { setMaintenance } = useMaintenance();

// ...
const result = await updateResumeAction(resumeId, payload);
if (result.success) {
  // ...
} else if (result.maintenance) {
  setMaintenance(true, result.message);
} else if (result.authError) {
  // 기존 로직
} else {
  showToast('저장에 실패했습니다.', 'negative');
}
```

동일한 패턴을 나머지 대상 파일들에도 반복 적용합니다.

---

## 7. 테스트 체크리스트

- [ ] 시크릿 모드(비로그인) 접속 후 백엔드에 점검모드 ON 요청 → `/maintenance`로 리다이렉트되는지
- [ ] 안내 화면의 `message`가 백엔드가 실제로 준 값으로 뜨는지 (고정 문구가 아니라)
- [ ] ADMIN 로그인 상태에서는 점검 중에도 리다이렉트 안 되는지
- [ ] 일반 유저 로그인 → 로그인 직후 다른 API 호출 시점에 점검 화면으로 전환되는지
- [ ] **★추가된 항목**: 비로그인 상태로 `/`, `/ai-analysis`, `/coffee-chat`, `/recommendations` 등 게스트 허용 페이지가 점검모드가 꺼져 있을 때 평소처럼 정상 접속되는지 (matcher를 넓히면서 생길 수 있는 회귀 — 반드시 확인)
- [ ] 6번 항목의 8~10곳 각각에서 저장/결제 등 시도 시 화면 전환되는지
- [ ] 점검모드 OFF 요청 후 정상 복귀되는지
- [ ] (선택) 같은 서버 인스턴스에서 5초 이내 재접속 시 `/maintenance/status`가 재호출 안 되는지 로그로 확인

---

## 8. 스코프 밖 — 나중에 참고

"점검 풀리면 자동 재시도" 기능은 지금 스코프에 없습니다. 나중에 붙일 경우 **재시도 최대 횟수 제한이 필수**입니다 — 401/503에 자동 재요청하다 그 재요청도 같은 이유로 실패하면 무한 루프로 서버에 요청이 쏟아지는 사고가 흔합니다(axios/fetch 무관). 지금 스코프(감지 후 화면 전환만)는 이 위험이 없습니다.

---

## 9. 백엔드 쪽에서 추가로 바꿀 건 없음

위 내용은 전부 프론트엔드 내부 구조 문제(Next.js 16 네이밍, 우리 사이트 라우팅 구조, 기존 에러 처리 컨벤션)를 바로잡는 것입니다. 백엔드가 이미 준 API 스펙(`GET /maintenance/status`, 503 + `COMMON_900`)은 그대로 쓰면 됩니다.
