import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// YYYY-MM 자동 하이픈
export function formatYearMonth(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}
 
// YYYY-MM-DD 자동 하이픈
export function formatYearMonthDay(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

// TTS로 읽을 때는 강조용 **를 그대로 읽지 않도록 제거
export function stripMarkdown(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

// 오픈 리다이렉트 방지 - 우리 사이트 내부 경로('/'로 시작하되 '//'는 프로토콜 상대 URL로 악용될 수 있어 제외)만 허용
export function isSafeReturnPath(path: string | null | undefined): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}
