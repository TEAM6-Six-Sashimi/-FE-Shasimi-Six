export interface AdminCourse {
  courseId: number;
  categoryName: string;
  title: string;
  instructorName: string;
  description: string;
  price: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  thumbnail: string;
  totalDuration: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  rejectReason: string | null;
  ratingAvg: number;
  reviewCount: number;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
}

export interface RejectedCourse {
  courseId: number;
  title: string;
  instructorName: string;
  categoryName: string;
  updatedAt: string | null;
  rejectCategory: string | null;
  rejectReason: string;
}

// 승인 대기 강의
export interface AdminPendingCourse {
  courseId: number;
  title: string;
  instructorName: string;
  instructorLoginId: string; // "강사 ID" 수정 필요
  categoryName: string;
  createdAt: string;
}

// 비공개된 강의
export interface AdminPrivateCourse {
  courseId: number;
  title: string;
  categoryName: string;
  instructorName: string;
  studentCount: number;
  ratingAvg: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';
  approvedAt: string;
}

// 카테고리 관리
export interface AdminCategory {
  id: number;
  code: string;
  mainCategoryName: string;
  subCategory: string;
  active: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  subCategory: string;
}

export class AdminApiError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}
