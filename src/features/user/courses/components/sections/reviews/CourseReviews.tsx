import { CourseReview, ReviewMode } from '@/features/user/courses/types';
import ReviewSummary from './ReviewSummary';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface CourseReviewsSectionProps {
  courseId: number;
  rating: number;
  reviewCount: number;
  reviews: CourseReview[];
  reviewMode: ReviewMode;
}

export default function CourseReviewsSection({
  courseId,
  rating,
  reviewCount,
  reviews,
  reviewMode,
}: CourseReviewsSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[#1E2125] text-[17px] font-bold">수강평</h2>

      {/* 평점 요약 (별점 분포는 백엔드 응답에 없어 평균/개수만 표시) */}
      <ReviewSummary rating={rating} reviewCount={reviewCount} />

      {/* writable: 작성 폼 표시 */}
      {reviewMode === 'writable' && <ReviewForm courseId={courseId} />}

      {/* readonly: 구매 후 작성 가능 안내문구만 표시 */}
      {reviewMode === 'readonly' && (
        <div className="bg-[#F9FAFB] rounded-lg px-4 py-4 font-medium text-[13px] text-[#6A7282]">
          강의 구매 후 리뷰를 작성할 수 있습니다.
        </div>
      )}

      {/* hidden-form: 폼/안내문구 없음 (강사 본인 강의, 관리자) */}
      {/* no-reviews: 안내문구 없이 바로 목록 영역에서 "등록된 수강평이 없습니다" 처리 */}

      <ReviewList reviews={reviews} isEmpty={reviewMode === 'no-reviews' || reviews.length === 0} />
    </section>
  );
}