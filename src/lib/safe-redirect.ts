// 오픈 리다이렉트 방지: 앱 내부의 상대 경로만 허용
// - 프로토콜 상대(protocol-relative) 외부 URL인 경우
// - 백슬래시를 슬래시로 오인하는 파서를 노리는 경우
// 를 모두 걸러낸다.
export function getSafeRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return '/';
  }
  return target;
}
