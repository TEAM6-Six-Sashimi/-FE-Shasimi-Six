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