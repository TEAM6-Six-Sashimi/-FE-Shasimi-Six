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
    preview: boolean;
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
  sessions: Session[];
}

export interface Session {
  id: number;
  title: string;
  videoUrl: string;
  materialFile?: string;
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
  rejectReason: string | null;
  ratingAvg: number;
  reviewCount: number;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
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
  // thumbnail: string; // 나중에 추가 필요
  // approvedAt: number;
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
  privatedAt: string; // 비공개 처리일
}