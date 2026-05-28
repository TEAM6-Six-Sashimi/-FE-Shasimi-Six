// ── 탭 타입 ──────────────────────────────────────────────────────
export type InstructorTab = 'dashboard' | 'approved' | 'pending';

// ── 강의 상태 타입 ────────────────────────────────────────────────
export type CourseStatus = 'approved' | 'pending' | 'archived' | 'rejected';

// ── 강의 타입 ─────────────────────────────────────────────────────
export interface InstructorCourse {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  price: number;
  rating: number;
  studentCount: number;
  status: CourseStatus;
  rejectionReason?: string;
}

// ── 대시보드 통계 ─────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  platformFee: number;
  withdrawable: number;
  totalSettled: number;
}

export interface CourseRevenue {
  id: number;
  title: string;
  revenue: number;
  studentCount: number;
  completionRate: number;
  completedCount: number;
  totalCount: number;
}

// ── 목업 데이터 ───────────────────────────────────────────────────
export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalRevenue: 38544300,
  platformFee: 11563290,
  withdrawable: 26981010,
  totalSettled: 0,
};

export const MOCK_COURSE_REVENUES: CourseRevenue[] = [
  { id: 1, title: 'React 완벽 가이드',       revenue: 19618600, studentCount: 1234, completionRate: 68, completedCount: 840,  totalCount: 1234 },
  { id: 2, title: 'TypeScript 마스터 클래스', revenue: 11044400, studentCount: 856,  completionRate: 54, completedCount: 462,  totalCount: 856  },
  { id: 3, title: 'Python Django 웹 개발',    revenue: 7881300,  studentCount: 567,  completionRate: 90, completedCount: 510,  totalCount: 567  },
];

export const MOCK_INSTRUCTOR_COURSES: InstructorCourse[] = [
  // 승인된 강의
  { id: 1, title: 'React 완벽 가이드',         category: 'AI·데이터', subCategory: 'AI 디자인·이미지', price: 15900, rating: 4.8, studentCount: 1234, status: 'approved' },
  { id: 2, title: 'TypeScript 마스터 클래스',   category: 'AI·데이터', subCategory: 'AI 디자인·이미지', price: 12900, rating: 4.8, studentCount: 1234, status: 'approved' },
  { id: 3, title: 'Python Django 웹 개발',      category: 'AI·데이터', subCategory: 'AI 디자인·이미지', price: 13900, rating: 4.8, studentCount: 1234, status: 'approved' },
  { id: 4, title: 'Vue.js 완전정복',            category: 'AI·데이터', subCategory: 'AI 디자인·이미지', price: 11900, rating: 4.7, studentCount: 987,  status: 'approved' },
  // 대기
  { id: 5, title: 'Next.js 14 완벽 정복',       category: 'AI·데이터', subCategory: 'AI 영상·사운드',   price: 18900, rating: 0,   studentCount: 0,    status: 'pending' },
  // 보관
  { id: 6, title: 'Node.js 백엔드 개발 실전',   category: 'AI·데이터', subCategory: '업무생산성·자동화', price: 14900, rating: 0,   studentCount: 0,    status: 'archived' },
  // 반려
  { id: 7, title: 'GraphQL API 설계 및 구현',   category: 'AI·데이터', subCategory: 'AI 디자인·이미지', price: 16900, rating: 0,   studentCount: 0,    status: 'rejected', rejectionReason: '강의 내용이 커리큘럼과 일치하지 않습니다. 커리큘럼을 수정 후 재신청해주세요.' },
];