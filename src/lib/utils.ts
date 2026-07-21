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

// YYYY-MM 형식이 다 채워졌고 월이 01~12 범위인지 검증
export function isValidYearMonth(value: string): boolean {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[2]);
  return month >= 1 && month <= 12;
}

// YYYY-MM-DD 형식이 다 채워졌고 실제로 존재하는 날짜인지 검증
export function isValidYearMonthDay(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// YYYY-MM-DD 문자열이 오늘보다 미래인지 검증 (형식이 올바르다는 전제)
export function isFutureDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const target = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return target.getTime() > today.getTime();
}

// TTS로 읽을 때는 강조용 **를 그대로 읽지 않도록 제거
export function stripMarkdown(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

// 오픈 리다이렉트 방지 - 우리 사이트 내부 경로만 허용
export function isSafeReturnPath(path: string | null | undefined): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}
