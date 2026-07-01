export interface CourseReview {
  reviewId: number;
  rating: number; // 1~5
  content: string;
  writerLoginId: string;
  createdAt: string;
}

// writable: (구매 후) 작성 가능 + 1번 작성가능 문구
// readonly: (구매 전) 구매후 작성가능 문구
// hidden-form: 입력폼x + 목록만
// no-reviews: 등록된 수강평이 없습니다
export type ReviewMode = 'writable' | 'readonly' | 'hidden-form' | 'no-reviews';
