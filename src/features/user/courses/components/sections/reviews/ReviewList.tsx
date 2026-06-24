'use client';

import { useState } from 'react';
import type { Review } from '@/constants/mockCourseDetail';
import { StarRating } from './ReviewSummary'

interface ReviewListProps {
  reviews: Review[];
  isEmpty?: boolean;
}

type SortType = '최신순' | '추천순';

export default function ReviewList({ reviews, isEmpty }: ReviewListProps) {
  const [sort, setSort] = useState<SortType>('최신순');

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center py-10 text-[#6A7282] text-[13.5px]">
        등록된 수강평이 없습니다.
      </div>
    );
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === '최신순') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return b.rating - a.rating;
  });

  return (
    <>
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
    </>
  )
}
