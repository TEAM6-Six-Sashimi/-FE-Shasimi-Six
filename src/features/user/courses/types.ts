// 강의 목록용
export interface CourseFromAPI {
  courseId: number;
  instructorName: string;
  title: string;
  price: number;
  thumbnail: string;
  totalDuration: number;
  ratingAvg: number;
  studentCount: number;
  approvedAt: string; // 등록일
  label?: string | null; // 인기, NEW
  categoryName: string;
}

// NCS 정보 (없으면 null)
export interface NcsInfo {
  categoryPath: string; // 분류
  jobDescription: string; // 직무 설명
  abilityUnitNames: string[]; // 능력단위명
  totalAbilityUnitCount: number;
}

export interface InstructorInfo {
  name: string;
  profileImagePath: string;
  bio: string;
  mainCareers: string[];
  portfolioUrl?: string;
}

export interface CourseReview {
  reviewId: number;
  rating: number; // 1~5
  content: string;
  writerLoginId: string;
  createdAt: string;
}

// 별점 분포 - 백엔드가 star별 개수(count)만 내려주고, 비율(%) 계산은 프론트 담당
export interface RatingDistributionItem {
  star: number;
  count: number;
}

export type ViewerType = 'PUBLIC' | 'ENROLLED' | 'OWNER' | 'ADMIN';
export type CourseStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';

export interface CourseSession {
  sessionId: number;
  sessionUid: string;
  title: string;
  videoUrl: string | null; // PUBLIC: preview 세션만 값 있음, 나머지 null
  durationSeconds: number;
  sessionOrder: number;
  preview: boolean;
  attachmentName: string | null;
  attachmentUrl: string | null; // presigned, 120분 만료
  attachmentType: string | null;
  attachmentSize: number | null;
  // ENROLLED일 때만 값 있음 - 세션별 시청 진행 정보
  lastPositionSeconds: number | null; // 마지막 시청 지점(초)
  sessionProgressRate: number | null; // 세션 진행률(%)
  sessionCompleted: boolean | null; // 세션 완료 여부
}

// 강의 상세 — GET /api/courses/{courseId} 응답 (viewerType 공통 스키마)
export interface CourseDetailFromAPI {
  viewerType: ViewerType;
  courseId: number;
  title: string;
  description: string;
  price: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail: string;
  totalDuration: number;
  ratingAvg: number;
  reviewCount: number;
  ratingDistribution: RatingDistributionItem[];
  studentCount: number;
  instructor: InstructorInfo;
  mainCategoryName: string;
  categoryName: string;
  ncs: NcsInfo | null;
  approvedAt: string | null;
  status: CourseStatus;
  rejectReason: string | null; // OWNER/ADMIN 반려 강의만 값 있음
  progressRate: number | null; // ENROLLED만 값 있음 (강의 전체 진행률)
  completed: boolean | null; // ENROLLED만 값 있음
  sessions: CourseSession[];
  reviews: CourseReview[];
}

// 수강 정보 (결제 확인용 - 별도 API)
export interface PaymentInfo {
  paymentId: number;
  courseId: number;
  progress: number;
  lastSessionId?: number; // 마지막 수강 세션 id(이어보기용)
  enrolledAt: string;
}

// 난이도 한글 변환
export const DIFFICULTY_LABEL: Record<string, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

export interface CourseDetail extends CourseFromAPI {
  categoryName: string;
}

// writable: (구매 후) 작성 가능 + 1번 작성가능 문구
// readonly: (구매 전) 구매후 작성가능 문구
// hidden-form: 입력폼x + 목록만
// no-reviews: 등록된 수강평이 없습니다
export type ReviewMode = 'writable' | 'readonly' | 'hidden-form' | 'no-reviews';