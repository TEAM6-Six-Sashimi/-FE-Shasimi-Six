'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CourseReview } from '../types';
import { StarRating } from './ReviewSummary';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import { useToast } from '@/components/ui/ToastContext';
import { useMaintenance } from '@/components/system/MaintenanceProvider';
import { logoutAction } from '@/features/auth/actions';
import { deleteReviewAction, reportReviewAction } from '../actions';
import ReportModal, { ReportCategoryOption } from '@/components/modals/ReportModal';
import Image from 'next/image';

interface ReviewListProps {
  courseId: number;
  reviews: CourseReview[];
  isEmpty?: boolean;
  currentUserLoginId?: string | null;
}

type SortType = '최신순' | '평점순';

const ITEMS_PER_PAGE = 5;

// 아이디 앞 4자리만 노출
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
  const { setMaintenance } = useMaintenance();
  const [sort, setSort] = useState<SortType>('최신순');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<CourseReview | null>(null);
  const [reportTarget, setReportTarget] = useState<CourseReview | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hoveredDeleteId, setHoveredDeleteId] = useState<number | null>(null);

  if (isEmpty) {
    return (
      <p className="flex items-center justify-center py-10 text-[#6A7282] text-[13.5px]">
        등록된 수강평이 없습니다.
      </p>
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

  const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
  const pagedReviews = sortedReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSortChange = (next: SortType) => {
    setSort(next);
    setCurrentPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isProcessing) return;
    setIsProcessing(true);

    const result = await deleteReviewAction(courseId, deleteTarget.reviewId);

    if (result.success) {
      setDeleteTarget(null);
      showToast('수강평이 삭제되었습니다.', 'positive');
      router.refresh();
    } else if (result.authError) {
      showToast(result.message, 'alarm');
      await logoutAction();
      return;
    } else if (result.maintenance) {
      setMaintenance(true, result.message);
    } else {
      showToast(result.message, 'negative');
    }
    setIsProcessing(false);
  };

  const handleReportConfirm = async (category: ReportCategoryOption['value'], reason: string) => {
    if (!reportTarget || isProcessing) return;
    setIsProcessing(true);

    const result = await reportReviewAction(reportTarget.reviewId, { category, reason });

    if (result.success) {
      setReportTarget(null);
      showToast('신고가 접수되었습니다.', 'positive');
    } else if (result.authError) {
      showToast(result.message, 'alarm');
      await logoutAction();
      return;
    } else if (result.maintenance) {
      setMaintenance(true, result.message);
    } else {
      showToast(result.message, 'negative');
    }
    setIsProcessing(false);
  };

  return (
    <>
      {/* 정렬 탭 */}
      <nav aria-label="수강평 정렬">
        <ul className="flex items-center gap-0 border-b border-[#E5E7EB] list-none">
          {(['최신순', '평점순'] as SortType[]).map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => handleSortChange(s)}
                aria-pressed={sort === s}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors duration-150 cursor-pointer ${
                  sort === s
                    ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                    : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
                }`}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 리뷰 목록 */}
      <ol className="flex flex-col gap-4" aria-label="수강평 목록">
        {pagedReviews.map((review) => {
          const mine = isMine(review);
          return (
            <li
              key={review.reviewId}
              className="flex flex-col gap-1.5 pb-4 border-b border-[#E5E7EB] last:border-none"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {/* 아바타 */}
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-[#E5E7EB] shrink-0 flex items-center justify-center text-[#6A7282] text-[12px]"
                  >
                    <Image src="/sidebar/mypage-Icon.svg" alt="" width={18} height={18} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {/* 작성자 정보 */}
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
                    {/* 별점 + 등록일 */}
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size={12} />
                      <time dateTime={review.createdAt} className="text-[#6A7282] text-[12px]">
                        {review.createdAt.slice(0, 10)}
                      </time>
                    </div>
                  </div>
                </div>

                {mine ? (
                  <button
                    type="button"
                    aria-label="수강평 삭제"
                    onClick={() => setDeleteTarget(review)}
                    onMouseEnter={() => setHoveredDeleteId(review.reviewId)}
                    onMouseLeave={() => setHoveredDeleteId(null)}
                    className="flex items-center gap-1 text-[#6A7282] text-[12px] hover:text-[#E7000B] transition-colors shrink-0 cursor-pointer"
                  >
                    <Image
                      src={
                        hoveredDeleteId === review.reviewId
                          ? '/delete-Icon-red.svg'
                          : '/delete-Icon-gray.svg'
                      }
                      width={13}
                      height={13}
                      alt=""
                    />
                    삭제
                  </button>
                ) : (
                  // 비로그인 게스트는 신고할 수 없으므로 버튼 자체를 노출하지 않음
                  currentUserLoginId && (
                    <button
                      type="button"
                      aria-label="수강평 신고"
                      onClick={() => setReportTarget(review)}
                      className="text-[#6A7282] text-[12px] hover:text-[#FF5E5E] transition-colors shrink-0 cursor-pointer flex items-center gap-0.5"
                    >
                      <span aria-hidden="true">⚠</span> 신고
                    </button>
                  )
                )}
              </div>
              <p className="text-[#1E2125] text-[13px] leading-relaxed pl-10">{review.content}</p>
            </li>
          );
        })}
      </ol>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <nav aria-label="페이지 이동">
          <ul className="flex items-center justify-center gap-1 list-none">
            <li>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="이전 페이지"
                className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
              >
                이전
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`${page}페이지`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#FF5E5E] text-white'
                      : 'text-[#1E2125] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="다음 페이지"
                className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
              >
                다음
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* 삭제 확인 모달 */}
      {deleteTarget && (
        <TwoButtonModal
          title="수강평 삭제 확인"
          message={
            '수강평은 작성 후 수정이 불가능하며, 삭제 후에도 다시 작성할 수 없습니다.\n정말 삭제하시겠습니까?'
          }
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
