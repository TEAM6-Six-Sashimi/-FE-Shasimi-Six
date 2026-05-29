export interface AdminCourse {
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

export interface RejectedCourse {
  id: number;
  title: string;
  instructorName: string;
  category: string;
  rejectedAt: string;
  rejectReason: string;
}