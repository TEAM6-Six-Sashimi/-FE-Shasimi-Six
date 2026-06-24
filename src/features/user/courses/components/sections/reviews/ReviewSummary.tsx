import type { RatingDistribution } from '@/constants/mockCourseDetail';

interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
  ratingDistribution: RatingDistribution[];
}

const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{ fontSize: size }}
        className={star <= Math.round(rating) ? 'text-[#FFD700]' : 'text-[#D1D5DB]'}
      >
        ★
      </span>
    ))}
  </div>
);

export default function ReviewSummary({
  rating,
  reviewCount,
  ratingDistribution,
}: ReviewSummaryProps) {
  return (
    <div className="flex items-center gap-8 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
      {/* 평균 평점 */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <span className="text-[#FF5E5E] text-[40px] font-bold leading-none">
          {rating.toFixed(1)}
        </span>
        <StarRating rating={rating} size={16} />
        <span className="text-[#6A7282] text-[12px]">{reviewCount}개의 평가</span>
      </div>

      {/* 별점 분포 */}
      <div className="flex flex-col gap-1.5 flex-1">
        {ratingDistribution.map(({ star, percentage }) => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-[#FFD700] text-[12px]">★</span>
            <span className="text-[#6A7282] text-[12px] w-3 shrink-0">{star}</span>
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#CFEE5D] rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[#6A7282] text-[12px] w-7 text-right shrink-0">
              {percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { StarRating };
