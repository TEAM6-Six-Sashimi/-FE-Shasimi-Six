export interface ApprovedCourse {
  courseId: number;
  categoryId: number;
  title: string;
  price: number;
  ratingAvg: number;
  studentCount: number;
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
}