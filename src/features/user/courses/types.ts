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
  approvedAt: string;   // 등록일
  label?: string | null;   // 인기, NEW 
}

// 강의 상세
export interface CourseDetailFromAPI {
  courseId: number;
  title: string;
  description: string;
  price: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail: string;
  totalDuration: number;
  ratingAvg: number;
  reviewCount: number;
  studentCount: number;
  instructorName: string;
  categoryName: string;
  sessions: CourseSession[];
}

export interface CourseSession {
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
}

// 수강 정보
export interface EnrollmentInfo {
  enrollmentId: number;
  courseId: number;
  progress: number;
  lastSessionId?: number; // 마지막 수강 세션 id(이어보기용)
  enrolledAt: string;
}

// 수강생용 강의 상세
export interface StudentCourseDetail extends CourseDetailFromAPI {
  progressRate: number;
  completed: boolean;
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
