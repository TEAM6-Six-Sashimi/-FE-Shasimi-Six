export interface CourseFromAPI {
  courseId: number;
  instructorName: string;
  title: string;
  price: number;
  thumbnail: string;
  totalDuration: number;
  ratingAvg: number;
  studentCount: number;
}

export interface CourseDetail extends CourseFromAPI {
  categoryName: string;
}