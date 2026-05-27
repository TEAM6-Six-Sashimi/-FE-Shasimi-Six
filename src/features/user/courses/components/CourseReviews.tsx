'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Review, RatingDistribution } from '@/constants/mockCourseDetail';

interface CourseReviewsProps {
  rating: number;
  reviewCount: number;
  ratingDistribution: RatingDistribution[];
  reviews: Review[];
  isPurchased?: boolean;
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

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isValid = rating > 0 && content.trim();

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isValid) return;
    // TODO: 리뷰 등록 API 연결
  };

  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-[#E5E7EB]">
      <h3 className="text-[15px] font-bold text-[#1E2125]">수강평 작성하기</h3>

      {/* 별점 */}
      <div>
        <p className="text-[13px] font-semibold text-[#1E2125] mb-2">
          평점 선택 <span className="text-[#FF5E5E]">*</span>
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-[28px] cursor-pointer transition-colors"
            >
              <span className={star <= rating ? 'text-[#FFD700]' : 'text-[#D1D5DB]'}>★</span>
            </button>
          ))}
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="flex items-center gap-2 bg-[#FFEBEB] rounded-lg px-3 py-2">
        <span className="text-[#FF5E5E] text-[13px]">⚠</span>
        <p className="text-[12.5px] text-[#FF5E5E]">
          강의평은 한 번만 작성할 수 있으며, 작성 후 수정이 불가합니다.
        </p>
      </div>

      {/* 텍스트 입력 */}
      <textarea
        placeholder="이 강의에 대한 솔직한 평가를 남겨주세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors resize-none"
      />

      {/* 리뷰 등록 버튼 */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="h-10 px-6 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[13.5px] cursor-pointer"
        >
          리뷰 등록
        </Button>
      </div>
    </div>
  );
}

export default function CourseReviews({
  rating,
  reviewCount,
  ratingDistribution,
  reviews,
  isPurchased = false,
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

      {/* 구매 후: 수강평 작성 폼 / 구매 전: 안내 메시지 */}
      {isPurchased ? (
        <ReviewForm />
      ) : (
        <div className="bg-[#F1FFC1] border border-[#CFEE5D] rounded-lg px-4 py-3 text-[13px] text-[#1E2125]">
          강의 구매 후 리뷰를 작성할 수 있습니다.
        </div>
      )}

      {/* 정렬 탭 */}
      <div className="flex items-center gap-0 border-b border-[#E5E7EB]">
        {(['최신순', '추천순'] as SortType[]).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors duration-150 cursor-pointer ${
              sort === s
                ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
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
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                {/* 아바타 */}
                <div className="w-8 h-8 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center text-[#6A7282] text-[12px]">
                  👤
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E2125] text-[13.5px] font-semibold">
                      {review.author}
                    </span>
                    <StarRating rating={review.rating} size={12} />
                    <span className="text-[#6A7282] text-[12px]">{review.date}</span>
                  </div>
                </div>
              </div>
              <button className="text-[#6A7282] text-[12px] hover:text-[#1E2125] transition-colors shrink-0 cursor-pointer flex items-center gap-0.5">
                <span>⚠</span> 신고
              </button>
            </div>
            <p className="text-[#1E2125] text-[13px] leading-relaxed pl-10">{review.content}</p>
          </div>
        ))}
      </div>

      {/* 더보기 */}
      {reviews.length >= 3 && (
        <button className="text-[#6A7282] text-[13px] hover:text-[#FF5E5E] transition-colors text-center py-1 cursor-pointer">
          최대 5개 그 후 페이징
        </button>
      )}
    </section>
  );
}
