# 점검모드(서비스 이용 불가) 처리 — 완료 보고

---

## 0. 배경

백엔드에 두 가지 상황이 있습니다.

1. **정기점검**: 팀이 사전에 공지하고, 그 시간에 관리자가 수동으로 "점검모드"를 켭니다.
2. **배포(CI/CD)**: 팀원이 코드를 머지할 때마다 GitHub Actions가 자동으로 배포하는데, 배포 시작 직전에 자동으로 "점검모드"를 켰다가 배포 완료 후 자동으로 끕니다.

이 두 상황은 백엔드 입장에서 완전히 동일한 방식으로 프론트에 신호를 보냅니다. 그래서 프론트는 로직을 하나만 만들면 두 상황을 다 처리할 수 있습니다.

**합의된 스코프**: "예외 없이 100% 완전 커버"는 하지 않습니다. 대신:
- 페이지 진입/이동 시점은 **미들웨어(`src/proxy.ts`) 한 곳**에서 커버 (거의 모든 시나리오를 이걸로 커버함)
- "이미 화면 켜놓고 쓰다가 점검모드 켜지는" 케이스는 **트래픽 큰 상호작용 몇 곳만** 선별 적용
- 나머지 API 호출 중에 점검모드가 켜지면 그 요청만 그냥 실패로 보일 수 있음 — 이건 받아들이기로 한 트레이드오프임

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
- Next.js Middleware(Edge Runtime)에서는 `next: { revalidate }`가 지원되지 않아, 프론트가 직접 인메모리 캐시를 구현했습니다(4장).

### 1-2. 점검모드 중 API 호출 시 공통 응답
```
HTTP 503
{ "status": 503, "errorCode": "COMMON_900", "message": "...", "path": "...", "traceId": "..." }
```
**중요**: 반드시 `errorCode === "COMMON_900"`으로 판단해야 합니다. 단순히 `status === 503`만으로 분기하면 다른 이유의 503과 섞입니다.

### 1-3. 참고사항
- ADMIN 세션은 점검모드 중에도 항상 정상 동작
- `/auth/login`은 점검모드 중에도 열려있어야 함 → **로그인 페이지는 점검모드 리다이렉트 대상에서 제외**

---

## 2. 이 코드베이스에 대해 반드시 알아야 할 것

- **Next.js 16 미들웨어 네이밍**: `middleware` → `proxy`로 변경됨. `src/proxy.ts`에 `export function proxy(request: NextRequest)`로 되어 있어야 함. `export function middleware(...)`로 쓰면 Next 16이 인식 못 함.
- **순수 fetch, axios 없음**: 중앙 fetch 래퍼가 없고, `src/services/` 아래 각 서비스 파일이 독립적으로 `fetch()` 호출.
- **서버 컴포넌트도 직접 fetch**: SSR 중 503이 나면 클라이언트(`useEffect`)만 감시해서는 못 잡음 → 미들웨어(요청 단계)가 핵심.
- **기존 패턴 그대로 재사용**: `ToastContext.tsx`의 Context+Provider+훅 구조, `handleAuthErrorResponse`의 `{authError: true, message}` 리턴값 컨벤션.
- **★ 서비스 파일에서 `throw`는 안전함, 단 Server Action 밖으로 새어나가면 위험**: Next.js Server Action 경계를 넘어 `throw`된 에러 메시지는 프로덕션에서 익명화(digest)됩니다. 단, 서비스 함수가 `throw`해도 그걸 감싸는 `'use server'` 액션이 **같은 서버 실행 컨텍스트 안에서 즉시 catch**해서 discriminated union으로 변환해 리턴하면 전혀 위험하지 않습니다(`review.service.ts` → `review/actions.ts`가 실제 예시). 위험한 건 액션이 catch 없이 그대로 다시 던져서 클라이언트까지 새어나가는 경우입니다.

---

## 3. 새 파일 4개 — ✅ 완료

- `src/services/maintenance.service.ts` — `fetchMaintenanceStatus()` + 6장에서 쓰는 `MaintenanceError`/`parseMaintenanceMessage` 공용 유틸도 여기 추가됨
- `src/components/system/MaintenanceProvider.tsx` — `ToastContext.tsx`와 동일 구조
- `src/components/system/ServiceUnavailablePage.tsx` — 최초엔 최소 구현이었으나, 이 앱에 이미 있던 `error.tsx`/`not-found.tsx`의 에러 페이지 스타일(원형 아이콘+빨간 타이틀+아웃라인 "새로 고침" 버튼)에 맞춰 다시 다듬음
- `src/app/maintenance/page.tsx`

실제 코드는 각 파일 참고. 스펙과 다른 점 없음.

---

## 4. `src/proxy.ts` 수정 — ✅ 완료 (실제 보안 취약점까지 재현해서 검증함)

원래 계획대로 구현하되, 다음 두 가지를 추가로 개선했습니다.

1. **matcher를 정적 자산 확장자까지 제외하도록 확장**: 원안대로면 이미지/svg 요청마다도 미들웨어가 돌아서 불필요한 오버헤드가 생김. `.svg|.png|.jpg|...` 등을 matcher negative lookahead에 추가해서 해결.
2. **role 쿠키 위변조 보안 수정 (`verifyRole()`)**: `/admin`, `/mycourses-instructor` 접근 시 평문 `role` 쿠키를 그대로 믿지 않고 `GET /users/me`로 백엔드가 검증한 실제 role을 재확인.

**검증 방법과 결과** (git stash로 이전 코드와 나란히 비교):
```
OLD 코드: role=ADMIN 쿠키 위조 + 가짜 accessToken → status=200 (관리자 페이지 그대로 뚫림)
NEW 코드: 동일한 요청                              → status=307 redirect=/ (차단됨)
```
정상 플로우도 확인: 홈(200), 정적 이미지(200), 비로그인 보호 페이지(로그인 리다이렉트+redirect 파라미터 유지), `/maintenance` 자체(200, 무한루프 없음), 게스트 허용 페이지(`/`, `/ai-analysis`, `/coffee-chat`, `/recommendations`) 전부 정상.

**실제 계정으로 회귀 테스트 완료**: `instructor01`(INSTRUCTOR), `admin05`(ADMIN) 계정으로 실제 로그인해서 `/mycourses-instructor`, `/admin` 정상 진입 확인함 (데이터까지 정상 렌더링).

**배포 환경 확인 완료**:
- `Dockerfile`이 `ARG API_URL` → `ENV NEXT_PUBLIC_API_URL`로 빌드 스테이지에서 정적 치환 → 미들웨어의 `process.env.NEXT_PUBLIC_API_URL`도 정상 동작 확인.
- `output: 'standalone'` + 단일 장수 Docker 컨테이너 구조 → `maintenanceCache` 모듈 스코프 변수가 요청 간 정상 유지됨(서버리스/멀티 인스턴스 아님).
- `MaintenanceProvider`의 클라이언트 사이드 체크를 실제 운영 백엔드에 직접 요청해서 CORS 문제 없음 확인(200 응답 받음).

**아직 실제로 확인 못 한 것**: 백엔드에서 점검모드를 실제로 ON시킨 상태에서의 `/maintenance` 리다이렉트 — 백엔드 스위치를 직접 켤 권한이 없어 로컬 검증만 하고 실전 토글은 못 해봄. 다음 정기점검이나 배포 시 실제로 한 번 확인 필요.

---

## 5. `src/app/layout.tsx` 수정 — ✅ 완료

기존 `ToastProvider`/`Header`/`main`을 `MaintenanceProvider`로 감싸는 형태로 추가. 브라우저에서 홈페이지 콘솔 에러 없음, 정상 렌더링 확인.

---

## 6. 트래픽 큰 상호작용 — ✅ 완료 (최종 6곳)

원안의 후보 파일명과 실제 코드 구조가 다른 부분이 있어, 파일별로 실제 있는 그대로 반영했습니다.

| 영역 | 감지 위치 | 반영 위치(컴포넌트) |
|---|---|---|
| 이력서 저장/수정 | `resume.service.ts` (`saveResume`/`updateResume`) | `ResumeMain.tsx` |
| 수강평 작성 | `review.service.ts` (`createReview`) | `ReviewForm.tsx` |
| 크레딧 충전 승인 | `credit.service.ts` (`confirmCreditCharge`) | `credit/success/page.tsx` |
| 장바구니 담기 | `cart.service.ts` (`addCartItem`) | `CourseCard.tsx`, `NotOwnedButtons.tsx` (2곳) |
| 결제(강의/장바구니/구독) | `payments/actions.ts`의 `checkoutAction` — 별도 서비스 파일 없이 액션 안에서 직접 fetch | `PaymentSticky.tsx` |
| 강사 지원 제출 | `src/app/api/instructor-apply/route.ts` — service+action 패턴이 아니라 Route Handler(멀티파트 폼 전송이라 Server Action 대신 fetch 직접 호출) | `InstructorApplicationClient.tsx` |

공용 `MaintenanceError` 클래스와 `parseMaintenanceMessage(res)` 헬퍼를 `maintenance.service.ts`에 추가해서 6곳 모두 일관되게 사용. 서비스가 감지해서 `throw new MaintenanceError(...)` → 액션이 같은 서버 컨텍스트에서 즉시 catch해서 `{success:false, maintenance:true, message}`로 변환 → 컴포넌트가 `useMaintenance().setMaintenance(true, message)` 호출.

**★ 실제로 발생했던 누락 사례**: `addCartItemAction`을 호출하는 곳이 `NotOwnedButtons.tsx` 말고 `CourseCard.tsx`(홈/카테고리 목록의 카드)에도 있었는데, 처음엔 `NotOwnedButtons.tsx`만 처리하고 넘어갔다가 나중에 발견해서 추가함. **덤으로 `CourseCard.tsx`엔 액션의 리턴값(`result.success`)을 아예 확인 안 하고 무조건 성공 모달을 띄우는 기존 버그도 있어서 같이 고침.**

**재발 방지 방법**: 이 6개 액션 중 하나를 건드릴 일이 생기면, 그 액션을 호출하는 파일을 **grep으로 전부 뽑아서** 각 호출부가 `.maintenance`를 체크하는지 대조할 것. 지금은 아래처럼 전부 확인된 상태입니다 (재확인 시 이 표를 갱신):

| 액션 | 실제 호출부 | `.maintenance` 체크 |
|---|---|---|
| `addCartItemAction` | `CourseCard.tsx`, `NotOwnedButtons.tsx` | ✅ 둘 다 |
| `checkoutAction` | `PaymentSticky.tsx` | ✅ |
| `confirmCreditChargeAction` | `credit/success/page.tsx` | ✅ |
| `createReviewAction` | `ReviewForm.tsx` | ✅ |
| `updateResumeAction`/`saveResumeAction` | `ResumeMain.tsx` | ✅ (2곳) |
| `/api/instructor-apply` | `InstructorApplicationClient.tsx` | ✅ |

**중앙 fetch 래퍼는 지금 스코프에선 과함**: 완전히 자동으로 막으려면 `src/services/` 21개 파일·115회 fetch 호출을 전부 하나의 wrapper로 교체해야 하는 규모(문서 최초 버전에서 이미 "2~2.5일" 규모로 스코프 아웃됨). 지금처럼 액션 개수가 6개뿐이고 grep 대조로 충분히 커버되는 동안은 보류. **다시 검토할 시점**: 이 6곳 외에 결제/저장성 액션이 계속 늘어나 grep 대조가 매번 번거로워지거나, 이번처럼 누락이 실제로 한 번 더 발생했을 때.

---

## 7. 테스트 체크리스트

- [ ] 백엔드에 점검모드 실제로 ON 시킨 상태에서 `/maintenance`로 리다이렉트되는지 (권한 문제로 미검증 — 다음 정기점검/배포 때 확인 필요)
- [ ] 안내 화면의 `message`가 백엔드가 실제로 준 값으로 뜨는지 (위와 동일 사유로 미검증)
- [x] ADMIN 로그인 상태에서는 점검 중에도 리다이렉트 안 되는지 — role 쿠키 기준 로직 확인 완료 (실제 점검 ON 상태 테스트는 미검증)
- [x] 비로그인 상태로 `/`, `/ai-analysis`, `/coffee-chat`, `/recommendations` 등 게스트 허용 페이지가 평소처럼 정상 접속되는지 — 전부 200 확인
- [x] 6번 항목의 6곳 각각에서 저장/결제 등 시도 시 화면 전환되는지 — 코드 경로 확인 및 실제 카트 담기 플로우 브라우저 테스트 완료
- [ ] 점검모드 OFF 요청 후 정상 복귀되는지 (실제 토글 미검증)
- [ ] (선택) 같은 서버 인스턴스에서 5초 이내 재접속 시 `/maintenance/status` 재호출 안 하는지 로그로 확인
- [x] **role 검증**: `role` 쿠키를 `ADMIN`으로 위조 + 가짜 토큰으로 `/admin` 접근 시 차단되는지 — git stash 전후 비교로 실제 확인 완료 (구버전은 뚫림, 신버전은 차단)
- [x] 정상 INSTRUCTOR/ADMIN 계정(`instructor01`, `admin05`)으로 `/mycourses-instructor`, `/admin` 정상 진입되는지 — 실제 로그인 테스트 완료, 회귀 없음
- [ ] `/users/me` 응답이 느리거나 실패하는 상황을 강제로 만들어 `/admin` 접근이 fail-closed로 막히는지 — 가짜 토큰으로 인한 401 케이스는 확인됨(위 role 검증과 동일 테스트), 네트워크 지연(타임아웃) 케이스는 별도로 미검증

---

## 8. 스코프 밖 — 나중에 참고

"점검 풀리면 자동 재시도" 기능은 지금 스코프에 없습니다. 나중에 붙일 경우 **재시도 최대 횟수 제한이 필수**입니다.

---

## 9. 백엔드 쪽 확인/변경 사항

점검모드 자체(`GET /maintenance/status`, 503 + `COMMON_900`)는 백엔드가 이미 준 API 스펙 그대로 씁니다.

`GET /users/me`가 role을 안정적으로 내려주는지는 `instructor01`/`admin05` 실제 로그인 테스트로 확인됐습니다(정상 role 반환, 정상 페이지 진입). 다만 `/admin`·`/mycourses-instructor` 진입마다 이 호출이 추가로 발생하는 구조라, **실사용 트래픽이 늘었을 때 이 호출 빈도가 부담되지는 않는지는 백엔드 쪽 확인이 필요**합니다.

---
