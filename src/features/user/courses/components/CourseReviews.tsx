'use client';

import { useState } from 'react';
import type { Review, RatingDistribution } from '@/constants/mockCourseDetail';

interface CourseReviewsProps {
  rating: number;
  reviewCount: number;
  ratingDistribution: RatingDistribution[];
  reviews: Review[];
}

type SortType = '최신순' | '추천순';

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

export default function CourseReviews({
  rating,
  reviewCount,
  ratingDistribution,
  reviews,
}: CourseReviewsProps) {
  const [sort, setSort] = useState<SortType>('최신순');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === '최신순') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.rating - a.rating;
  });

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[#1E2125] text-[17px] font-bold">수강평</h2>

      {/* 평점 요약 */}
      <div className="flex items-center gap-8 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
        {/* 평균 평점 */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-[#1E2125] text-[40px] font-bold leading-none">
            {rating.toFixed(1)}
          </span>
          <StarRating rating={rating} size={16} />
          <span className="text-[#6A7282] text-[12px]">{reviewCount}개의 평가</span>
        </div>

        {/* 별점 분포 */}
        <div className="flex flex-col gap-1.5 flex-1">
          {ratingDistribution.map(({ star, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-[#6A7282] text-[12px] w-3 shrink-0">{star}</span>
              <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFD700] rounded-full"
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

      {/* 구매 안내 */}
      <div className="bg-[#F1FFC1] border border-[#CFEE5D] rounded-lg px-4 py-3 text-[13px] text-[#1E2125]">
        강의 구매 후 리뷰를 작성할 수 있습니다.
      </div>

      {/* 정렬 탭 */}
      <div className="flex items-center gap-0 border-b border-[#E5E7EB]">
        {(['최신순', '추천순'] as SortType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors duration-150 cursor-pointer ${
              sort === s
                ? 'border-[#1E2125] text-[#1E2125] font-semibold'
                : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 리뷰 목록 */}
      <div className="flex flex-col gap-4">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col gap-1.5 pb-4 border-b border-[#E5E7EB] last:border-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#1E2125] text-[13.5px] font-semibold">{review.author}</span>
                <StarRating rating={review.rating} size={12} />
              </div>
              <span className="text-[#6A7282] text-[12px]">{review.date}</span>
            </div>
            <p className="text-[#1E2125] text-[13px] leading-relaxed">{review.content}</p>
            <button className="text-[#6A7282] text-[12px] hover:text-[#1E2125] transition-colors w-fit cursor-pointer">
              신고
            </button>
          </div>
        ))}
      </div>

      {/* 더보기 */}
      {reviews.length >= 3 && (
        <button className="text-[#6A7282] text-[13px] hover:text-[#1E2125] transition-colors text-center py-1 cursor-pointer">
          최대 그 몇 페이지
        </button>
      )}
    </section>
  );
}
