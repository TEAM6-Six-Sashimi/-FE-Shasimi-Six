interface ReviewSummaryProps {
  rating: number;
  reviewCount: number;
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

export default function ReviewSummary({ rating, reviewCount }: ReviewSummaryProps) {
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
    </div>
  );
}

export { StarRating };