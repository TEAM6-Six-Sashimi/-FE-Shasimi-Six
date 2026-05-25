// 1. Role 타입 정의
export type UserRole = 'ADMIN' | 'STUDENT' | 'TEACHER';

// 2. 유저 정보
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: UserRole; // 백엔드에 맞춰 변경 필요
}