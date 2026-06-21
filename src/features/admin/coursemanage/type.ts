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
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
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
  rejectReason: string;
}
