export interface SessionAttachment {
  attachmentName: string;
  attachmentUrl: string;
  attachmentType: string;
  attachmentSize: number;
}

export interface CreateCourseRequest {
  subCategoryName: string;
  title: string;
  description: string;
  price: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail: string;
  initialStatus: 'DRAFT' | 'PENDING';
  sessions: {
    title: string;
    videoUrl: string;
    durationSeconds: number;
    preview: boolean;
    attachmentName?: string;
    attachmentUrl?: string;
    attachmentType?: string;
    attachmentSize?: number;
  }[];
}

export interface CourseFormData {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number | '';
  level: string;
  thumbnail: string;
  thumbnailFile?: File | null;
  sessions: Session[];
}

export interface Session {
  id: number;
  title: string;
  videoFile?: File | null;
  videoUrl: string; // 업로드 후 채워짐 (혹은 기존 영상 URL, 수정 시)
  durationSeconds: number; // 영상 길이(초) — 업로드 시 클라이언트에서 측정
  materialFile?: File | null;
  materialUrl?: string; // 업로드 후 채워짐 (혹은 기존 자료 URL, 수정 시)
  materialName?: string;
  materialType?: string;
  materialSize?: number;
  preview: boolean;
}

export interface UpdateCourseRequest {
  categoryId: number;
  title: string;
  description: string;
  price: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail: string;
  targetStatus: 'DRAFT' | 'PENDING';
  sessions: {
    title: string;
    videoUrl: string;
    preview: boolean;
    attachmentName?: string;
    attachmentUrl?: string;
    attachmentType?: string;
    attachmentSize?: number;
  }[];
}

export interface CourseEditFormData {
  courseId: number;
  categoryId: number;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  price: number | '';
  level: string;
  thumbnail: string;
  thumbnailFile?: File | null;
  sessions: Session[];
}

export interface InstructorInProgressCourse {
  courseId: number;
  categoryId: number;
  title: string;
  description: string;
  price: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail: string;
  totalDuration: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectCategory: string | null;
  rejectReason: string | null;
  ratingAvg: number;
  reviewCount: number;
  studentCount: number;
  createdAt: string;
  updatedAt: string; // REJECTED 상태일 때 반려일로도 사용
  approvedAt: string | null;
  sessions: {
    sessionId: number;
    sessionUid: string;
    title: string;
    videoUrl: string;
    durationSeconds: number;
    sessionOrder: number;
    preview: boolean;
    attachmentName: string;
    attachmentUrl: string;
    attachmentType: string;
    attachmentSize: number;
  }[];
}

export interface ApprovedCourse {
  courseId: number;
  categoryId: number;
  title: string;
  price: number;
  ratingAvg: number;
  studentCount: number;
}

export interface PrivateCourse {
  courseId: number;
  categoryId: number;
  title: string;
  thumbnail: string;
  price: number;
  ratingAvg: number;
  studentCount: number;
  privatedAt?: string; // 비공개 처리일
}

// 대시보드 - 요약 카드
export interface InstructorDashboardSummary {
  year: number;
  month: number;
  totalSales: number;
  platformFee: number;
  settlementAmount: number;
  platformFeeRate: number;
}

// 대시보드 - 매출 통계
export interface InstructorSalesStatisticsCourse {
  courseId: number;
  title: string;
  salesAmount: number;
}

export interface InstructorSalesStatistics {
  year: number;
  month: number;
  totalSales: number;
  courses: InstructorSalesStatisticsCourse[];
}

// 대시보드 - 수강생 수 통계
export interface InstructorStudentStatisticsCourse {
  courseId: number;
  title: string;
  studentCount: number;
}

export interface InstructorStudentStatistics {
  totalStudentCount: number;
  courses: InstructorStudentStatisticsCourse[];
}

// 대시보드 - 완강률 통계
export interface InstructorCompletionRateCourse {
  courseId: number;
  title: string;
  totalStudentCount: number;
  completedStudentCount: number;
  completionRate: number;
}

export interface InstructorCompletionRateStatistics {
  courses: InstructorCompletionRateCourse[];
}
