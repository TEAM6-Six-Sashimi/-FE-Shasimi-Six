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

// YYYY-MM 형식이 다 채워졌고(연/월 둘 다) 월이 01~12 범위인지 검증
export function isValidYearMonth(value: string): boolean {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[2]);
  return month >= 1 && month <= 12;
}

// YYYY-MM-DD 형식이 다 채워졌고 실제로 존재하는 날짜인지 검증 (예: 2024-02-30, 2024-13-01 모두 false)
export function isValidYearMonthDay(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  // JS Date는 범위를 벗어난 값을 다음 달/해로 자동 보정하므로, 되돌려서 값이 그대로인지 확인해야
  // 존재하지 않는 날짜(2월 30일 등)를 걸러낼 수 있다.
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// YYYY-MM-DD 문자열이 오늘보다 미래인지 검증 (형식이 올바르다는 전제하에 호출할 것)
export function isFutureDate(value: string): boolean {
  // new Date("YYYY-MM-DD")는 그 문자열을 UTC 자정으로 해석하는데, 로컬 타임존이 UTC보다
  // 앞선(KST 등) 경우 로컬 자정과 비교하면 "오늘"조차 미래로 잘못 판정된다. y/m/d를 각각
  // 숫자로 분리해 로컬 타임존 기준으로 직접 Date를 만들어 비교해야 이 문제가 없다.
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

// 오픈 리다이렉트 방지 - 우리 사이트 내부 경로('/'로 시작하되 '//'는 프로토콜 상대 URL로 악용될 수 있어 제외)만 허용
export function isSafeReturnPath(path: string | null | undefined): path is string {
  return !!path && path.startsWith('/') && !path.startsWith('//');
}
