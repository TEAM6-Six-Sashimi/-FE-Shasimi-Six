export interface Course {
  courseId: number;
  instructorName: string;
  title: string;
  price: number;
  thumbnail: string;
  totalDuration: number;
  ratingAvg: number;
  studentCount: number;
  category?: string;
}
