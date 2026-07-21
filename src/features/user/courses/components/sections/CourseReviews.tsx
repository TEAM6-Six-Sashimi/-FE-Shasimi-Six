import { RatingDistributionItem } from '@/features/user/courses/types';
import ReviewForm from '@/features/user/review/components/ReviewForm';
import ReviewList from '@/features/user/review/components/ReviewList';
import ReviewSummary from '@/features/user/review/components/ReviewSummary';
import { CourseReview, ReviewMode } from '@/features/user/review/types';

interface CourseReviewsSectionProps {
  courseId: number;
  rating: number;
  reviewCount: number;
  ratingDistribution: RatingDistributionItem[];
  reviews: CourseReview[];
  reviewMode: ReviewMode;
  // 강의 전체 진행률(%)
  progressRate: number | null;
  currentUserLoginId?: string | null;
}

export default function CourseReviewsSection({
  courseId,
  rating,
  reviewCount,
  ratingDistribution,
  reviews,
  reviewMode,
  progressRate,
  currentUserLoginId,
}: CourseReviewsSectionProps) {
  const hasReviewed =
    !!currentUserLoginId && reviews.some((review) => review.writerLoginId === currentUserLoginId);
  // 수강을 아직 시작하지 않은 경우(진행률 0%), 수강평 작성불가를 사용자에게 미리 안내
  const hasNotStarted = reviewMode === 'writable' && !progressRate;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[#1E2125] text-[17px] font-bold">수강평</h2>

      <ReviewSummary
        rating={rating}
        reviewCount={reviewCount}
        ratingDistribution={ratingDistribution}
      />

      {reviewMode === 'writable' && hasReviewed && (
        <div className="bg-[#F9FAFB] rounded-lg px-4 py-4 font-medium text-[13px] text-[#6A7282]">
          수강평이 이미 등록되어 있습니다.
        </div>
      )}

      {reviewMode === 'writable' && !hasReviewed && hasNotStarted && (
        <div className="bg-[#F9FAFB] rounded-lg px-4 py-4 font-medium text-[13px] text-[#6A7282]">
          강의를 수강한 후에 수강평을 작성할 수 있습니다.
        </div>
      )}

      {reviewMode === 'writable' && !hasReviewed && !hasNotStarted && (
        <ReviewForm courseId={courseId} />
      )}

      {reviewMode === 'readonly' && (
        <div className="bg-[#F9FAFB] rounded-lg px-4 py-4 font-medium text-[13px] text-[#6A7282]">
          강의 구매 후 리뷰를 작성할 수 있습니다.
        </div>
      )}

      <ReviewList
        courseId={courseId}
        reviews={reviews}
        isEmpty={reviewMode === 'no-reviews' || reviews.length === 0}
        currentUserLoginId={currentUserLoginId}
      />
    </section>
  );
}
