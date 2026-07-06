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

// 승인 대기 강의
export interface AdminPendingCourse {
  courseId: number;
  title: string;
  instructorName: string;
  instructorLoginId: string;
  categoryName: string;
  createdAt: string;
}

// 강의 반려 사유 카테고리
export interface RejectReasonCategory {
  code: string;
  label: string;
}

// 반려된 강의
export interface RejectedCourse {
  courseId: number;
  title: string;
  instructorName: string;
  categoryName: string;
  updatedAt: string | null;
  rejectCategory: RejectReasonCategory;
  rejectDetail: string;
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
