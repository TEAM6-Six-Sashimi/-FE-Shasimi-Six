// 오픈 리다이렉트 방지
export function getSafeRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return '/';
  }
  return target;
}
