'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/ui/SearchInput';
import Image from 'next/image';
import type { InstructorInProgressCourse } from '../types';
import type { Category } from '@/features/categories/types';
import { deleteCourseAction } from '../actions';
import { logoutAction } from '@/features/auth/actions';
import { useToast } from '@/components/ui/ToastContext';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import RejectDetailModal from '@/components/modals/RejectDetailModal';
import InlineDotsLoading from '@/components/ui/InlineDotsLoading';

type FilterType = '전체' | '대기' | '보관' | '반려';

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  DRAFT: '보관',
  REJECTED: '반려',
};

const STATUS_STYLE: Record<string, string> = {
  대기: 'bg-[#FEF3C7] text-[#92400E]',
  보관: 'bg-[#E5E7EB] text-[#6A7282]',
  반려: 'bg-[#FFEBEB] text-[#FF5E5E]',
};

interface Props {
  courses: InstructorInProgressCourse[];
  categories: Category[];
}

interface RejectionModalData {
  courseTitle: string;
  rejectedAt: string;
  rejectCategory: string;
  rejectReason: string;
}

const ITEMS_PER_PAGE = 5;

// rejectCategory가 비어 있으면 첫 ":" 기준으로 분리해 관리자 화면과 동일하게 나눠서 보여줌
const splitRejectReason = (category: string | null, reason: string | null) => {
  const rawReason = reason ?? '';
  if (category) return { category, detail: rawReason };

  const separatorIndex = rawReason.indexOf(': ');
  if (separatorIndex === -1) return { category: '', detail: rawReason };

  return {
    category: rawReason.slice(0, separatorIndex),
    detail: rawReason.slice(separatorIndex + 2),
  };
};

export default function PendingCourse({ courses, categories }: Props) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('전체');
  const [rejectionModal, setRejectionModal] = useState<RejectionModalData | null>(null);
  const [localCourses, setLocalCourses] = useState(courses);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);

  const getCategoryName = (categoryId: number) => {
    for (const cat of categories) {
      if (cat.mainCategoryId === categoryId) return cat.name;
      const option = cat.options?.find((o) => o.id === categoryId);
      if (option) return cat.name;
    }
    return String(categoryId);
  };

  const filtered = localCourses.filter((c) => {
    const matchSearch = c.title.includes(search);
    const statusLabel = STATUS_LABEL[c.status] ?? '';
    const matchFilter =
      filter === '전체' ||
      (filter === '대기' && statusLabel === '대기') ||
      (filter === '보관' && statusLabel === '보관') ||
      (filter === '반려' && statusLabel === '반려');
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async () => {
    if (deleteTargetId === null) return;
    setDeleteLoading(true);

    const result = await deleteCourseAction(deleteTargetId);

    if (result.success) {
      setLocalCourses((prev) => prev.filter((c) => c.courseId !== deleteTargetId));
      setDeleteTargetId(null);
    } else if (result.authError) {
      showToast(result.message, 'alarm');
      await logoutAction();
      return;
    } else {
      showToast(result.message, 'negative');
    }
    setDeleteLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 min-h-[63vh]">
      {/* 검색 + 강의 신청 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-sm">
          <SearchInput
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="강의 검색..."
            className="w-full"
          />
        </div>
        <Link href="/mycourses-instructor/new" className="shrink-0">
          <Button className="h-11 px-5 w-full sm:w-auto bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[13px] font-semibold cursor-pointer shrink-0">
            + 신규 강의 신청
          </Button>
        </Link>
      </div>

      {/* 필터 버튼 */}
      <div className="flex items-center gap-2 mb-3">
        {(['전체', '대기', '보관', '반려'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors cursor-pointer ${
              filter === f
                ? 'bg-[#FF5E5E] border-[#FF5E5E] text-white'
                : 'bg-white border-[#D1D5DB] text-[#6A7282] hover:border-[#1E2125] hover:text-[#1E2125]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 강의 목록 */}
      <div className="flex flex-col gap-3">
        {localCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3 text-[#6A7282]">
            <p className="text-[16px] font-medium">신청한 강의가 없습니다.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#6A7282] text-[16px] font-medium">
            해당하는 강의가 없습니다.
          </div>
        ) : (
          paged.map((course) => {
            const statusLabel = STATUS_LABEL[course.status] ?? course.status;
            const isPending = course.status === 'PENDING';
            const isDeleteDisabled = isPending || deleteLoading;
            return (
              <div
                key={course.courseId}
                className="bg-white rounded-xl border border-[#D1D5DB] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11.5px] font-semibold ${STATUS_STYLE[statusLabel] ?? ''}`}
                    >
                      {statusLabel}
                    </span>
                    {course.status === 'REJECTED' && course.rejectReason && (
                      <button
                        onClick={() => {
                          const { category, detail } = splitRejectReason(
                            course.rejectCategory,
                            course.rejectReason,
                          );
                          setRejectionModal({
                            courseTitle: course.title,
                            rejectedAt: course.updatedAt?.slice(0, 10) ?? '',
                            rejectCategory: category,
                            rejectReason: detail,
                          });
                        }}
                        className="text-[11.5px] text-[#FF5E5E] font-semibold underline cursor-pointer"
                      >
                        반려 사유 보기
                      </button>
                    )}
                  </div>
                  <p className="text-[14.5px] font-semibold text-[#1E2125]">{course.title}</p>
                  <p className="text-[12px] text-[#6A7282]">{getCategoryName(course.categoryId)}</p>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                  <span className="text-[15px] font-bold text-[#1E2125]">
                    {course.price.toLocaleString()}{' '}
                    <span className="text-[13px] font-normal text-[#6A7282]">크레딧</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <Button
                        size="sm"
                        disabled
                        className="h-9 px-4 text-[12.5px] font-semibold text-[#6A7282] bg-[#E5E7EB] cursor-not-allowed"
                      >
                        <Image src="/edit-Icon-gray.svg" alt="" width={16} height={16} /> 수정
                      </Button>
                    ) : (
                      <Link href={`/mycourses-instructor/${course.courseId}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 border-[#D1D5DB] text-[#1E2125] text-[12.5px] font-semibold hover:bg-[#F9FAFB] cursor-pointer"
                        >
                          <Image src="/edit-Icon-black.svg" alt="" width={16} height={16} /> 수정
                        </Button>
                      </Link>
                    )}
                    {isDeleteDisabled ? (
                      <Button
                        size="sm"
                        disabled
                        className="h-9 px-4 text-[12.5px] font-semibold text-[#6A7282] bg-[#E5E7EB] cursor-not-allowed"
                      >
                        <Image src="/delete-Icon-gray.svg" alt="" width={16} height={16} />{' '}
                        {deleteLoading ? <InlineDotsLoading label="삭제 중" /> : '삭제'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setDeleteTargetId(course.courseId)}
                        className="h-9 px-4 text-[12.5px] font-semibold bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer"
                      >
                        <Image src="/delete-Icon-white.svg" alt="" width={16} height={16} /> 삭제
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                page === p
                  ? 'bg-[#1E2125] text-white'
                  : 'text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            다음
          </button>
        </div>
      )}

      {/* 반려 사유 모달 (공용) */}
      {rejectionModal !== null && (
        <RejectDetailModal
          fields={[
            { label: '강의명', value: rejectionModal.courseTitle },
            { label: '반려일', value: rejectionModal.rejectedAt },
          ]}
          category={rejectionModal.rejectCategory}
          detail={rejectionModal.rejectReason}
          onClose={() => setRejectionModal(null)}
        />
      )}

      {deleteTargetId !== null && (
        <TwoButtonModal
          title="강의 삭제"
          message={`정말 삭제하시겠습니까?\n삭제된 강의는 복구할 수 없습니다.`}
          confirmLabel="삭제"
          cancelLabel="취소"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
}
