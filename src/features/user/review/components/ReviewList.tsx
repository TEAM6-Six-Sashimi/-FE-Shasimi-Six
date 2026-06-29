'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseReview } from '@/features/user/courses/types';
import { StarRating } from './ReviewSummary';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import { deleteReviewAction, reportReviewAction } from '../actions';
import ReportModal, { ReportCategoryOption } from '@/components/modals/ReportModal';
import Image from 'next/image';

interface ReviewListProps {
  courseId: number;
  reviews: CourseReview[];
  isEmpty?: boolean;
  /** 현재 로그인한 사용자의 loginId - 본인 글 판별 및 정렬에 사용 */
  currentUserLoginId?: string | null;
}

type SortType = '최신순' | '추천순';

// 아이디 앞 4자리만 노출 (예: "hong123" → "hong****")
function maskLoginId(loginId: string): string {
  if (loginId.length <= 4) return loginId;
  return `${loginId.slice(0, 4)}${'*'.repeat(loginId.length - 4)}`;
}

export default function ReviewList({
  courseId,
  reviews,
  isEmpty,
  currentUserLoginId,
}: ReviewListProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [sort, setSort] = useState<SortType>('최신순');
  const [deleteTarget, setDeleteTarget] = useState<CourseReview | null>(null);
  const [reportTarget, setReportTarget] = useState<CourseReview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center py-10 text-[#6A7282] text-[13.5px]">
        등록된 수강평이 없습니다.
      </div>
    );
  }

  const isMine = (review: CourseReview) =>
    !!currentUserLoginId && review.writerLoginId === currentUserLoginId;

  const sortedReviews = [...reviews].sort((a, b) => {
    // 본인 글을 항상 최상단으로
    const aMine = isMine(a) ? 1 : 0;
    const bMine = isMine(b) ? 1 : 0;
    if (aMine !== bMine) return bMine - aMine;

    if (sort === '최신순') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.rating - a.rating;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isProcessing) return;
    setIsProcessing(true);
    try {
      await deleteReviewAction(courseId, deleteTarget.reviewId);
      setDeleteTarget(null);
      showToast('수강평이 삭제되었습니다.', 'positive');
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : '수강평 삭제에 실패했습니다.', 'negative');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReportConfirm = async (category: ReportCategoryOption['value'], reason: string) => {
    if (!reportTarget || isProcessing) return;
    setIsProcessing(true);
    try {
      await reportReviewAction(reportTarget.reviewId, { category, reason });
      setReportTarget(null);
      showToast('신고가 접수되었습니다.', 'positive');
    } catch (error) {
      showToast(error instanceof Error ? error.message : '신고 처리에 실패했습니다.', 'negative');
    } finally {
      setIsProcessing(false);
    }
  };

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
        {sortedReviews.map((review) => {
          const mine = isMine(review);
          return (
            <div
              key={review.reviewId}
              className="flex flex-col gap-1.5 pb-4 border-b border-[#E5E7EB] last:border-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* 아바타 */}
                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center text-[#6A7282] text-[12px]">
                    👤
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {/* 1줄: 아이디(4자리만) + 내 리뷰 라벨 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[#1E2125] text-[13.5px] font-semibold">
                        {maskLoginId(review.writerLoginId)}
                      </span>
                      {mine && (
                        <span className="px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-[#F9FBE7] text-[#827717]">
                          내 리뷰
                        </span>
                      )}
                    </div>
                    {/* 2줄: 별점 + 등록일 */}
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size={12} />
                      <span className="text-[#6A7282] text-[12px]">
                        {review.createdAt.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </div>

                {mine ? (
                  <button
                    onClick={() => setDeleteTarget(review)}
                    className="flex items-center gap-1 text-[#6A7282] text-[12px] hover:text-[#FF5E5E] transition-colors shrink-0 cursor-pointer"
                  >
                    <Image src="/delete-Icon-gray.svg" width={13} height={13} alt="" />
                    삭제
                  </button>
                ) : (
                  <button
                    onClick={() => setReportTarget(review)}
                    className="text-[#6A7282] text-[12px] hover:text-[#1E2125] transition-colors shrink-0 cursor-pointer flex items-center gap-0.5"
                  >
                    <span>⚠</span> 신고
                  </button>
                )}
              </div>
              <p className="text-[#1E2125] text-[13px] leading-relaxed pl-10">{review.content}</p>
            </div>
          );
        })}
      </div>

      {/* 더보기 */}
      {reviews.length >= 3 && (
        <button className="text-[#6A7282] text-[13px] hover:text-[#FF5E5E] transition-colors text-center py-1 cursor-pointer">
          최대 5개 그 후 페이징
        </button>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <TwoButtonModal
          title="수강평 삭제 확인"
          message={'수강평 삭제하시면 다시 작성하실 수\n없습니다. 삭제하시겠습니까?'}
          confirmLabel={isProcessing ? '삭제 중...' : '확인'}
          cancelLabel="취소"
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isProcessing && setDeleteTarget(null)}
        />
      )}

      {/* 신고 모달 */}
      {reportTarget && (
        <ReportModal
          onConfirm={handleReportConfirm}
          onCancel={() => !isProcessing && setReportTarget(null)}
          loading={isProcessing}
        />
      )}
    </>
  );
}
