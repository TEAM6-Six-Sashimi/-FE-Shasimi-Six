'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { InstructorInProgressCourse } from '../types';
import type { Category } from '@/features/categories/types';
import { deleteCourseAction } from '../actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
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

export default function PendingCourse({ courses, categories }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('전체');
  const [rejectionModal, setRejectionModal] = useState<RejectionModalData | null>(null);
  const [localCourses, setLocalCourses] = useState(courses);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      setDeleteLoading(true);
      await deleteCourseAction(deleteTargetId);
      setLocalCourses((prev) => prev.filter((c) => c.courseId !== deleteTargetId));
      setDeleteTargetId(null);
    } catch {
      alert('삭제 처리에 실패했습니다.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 min-h-[63vh]">
      {/* 검색 + 강의 신청 버튼 */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="강의 검색..."
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
        </div>
        <Link href="/mycourses-instructor/new">
          <Button className="h-11 px-5 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[13px] font-semibold cursor-pointer shrink-0">
            + 신규 강의 신청
          </Button>
        </Link>
      </div>

      {/* 필터 버튼 */}
      <div className="flex items-center gap-2 mb-3">
        {(['전체', '대기', '보관', '반려'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
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
          filtered.map((course) => {
            const statusLabel = STATUS_LABEL[course.status] ?? course.status;
            const isPending = course.status === 'PENDING';
            const isDeleteDisabled = isPending || deleteLoading;
            return (
              <div
                key={course.courseId}
                className="bg-white rounded-xl border border-[#D1D5DB] px-5 py-4 flex items-center justify-between"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11.5px] font-semibold ${STATUS_STYLE[statusLabel] ?? ''}`}
                    >
                      {statusLabel}
                    </span>
                    {course.status === 'REJECTED' && course.rejectReason && (
                      <button
                        onClick={() =>
                          setRejectionModal({
                            courseTitle: course.title,
                            rejectedAt: course.updatedAt ?? '',
                            rejectCategory: course.rejectCategory ?? '',
                            rejectReason: course.rejectReason ?? '',
                          })
                        }
                        className="text-[11.5px] text-[#FF5E5E] font-semibold underline cursor-pointer"
                      >
                        반려 사유 보기
                      </button>
                    )}
                  </div>
                  <p className="text-[14.5px] font-semibold text-[#1E2125]">{course.title}</p>
                  <p className="text-[12px] text-[#6A7282]">{getCategoryName(course.categoryId)}</p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
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
                        <Image
                          src='/edit-Icon-gray.svg'
                          alt=""
                          width={16}
                          height={16}
                        />{' '}
                        수정
                      </Button>
                    ) : (
                      <Link href={`/mycourses-instructor/${course.courseId}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 border-[#D1D5DB] text-[#1E2125] text-[12.5px] font-semibold hover:bg-[#F9FAFB] cursor-pointer"
                        >
                          <Image
                          src='/edit-Icon-black.svg'
                          alt=""
                          width={16}
                          height={16}
                          />{' '} 수정
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
                        <Image src="/delete-Icon-white.svg" alt="" width={16} height={16} />{' '}
                        삭제
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 반려 사유 모달 */}
      {rejectionModal !== null && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setRejectionModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[19px] font-bold text-[#1E2125]">반려 사유 상세</h3>
              <button
                onClick={() => setRejectionModal(null)}
                className="text-[#9CA3AF] hover:text-[#1E2125] transition-colors cursor-pointer text-[18px]"
              >
                ✕
              </button>
            </div>
 
            {/* 강의명 / 반려일 */}
            <div className="grid grid-cols-2 gap-x-10 bg-[#F9FAFB] rounded-xl px-4 py-3.5 mb-5">
              <div>
                <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">강의명</p>
                <p className="text-[14.5px] font-bold text-[#1E2125]">
                  {rejectionModal.courseTitle}
                </p>
              </div>
              <div>
                <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">반려일</p>
                <p className="text-[14.5px] font-bold text-[#1E2125]">
                  {rejectionModal.rejectedAt}
                </p>
              </div>
            </div>
 
            {/* 사유 카테고리 */}
            <div className="mb-4">
              <p className="text-[13px] text-[#6A7282] mb-1.5">사유 카테고리</p>
              <span className="inline-block px-3 py-1.5 rounded-md text-[13px] font-semibold bg-[#FFEBEB] text-[#FF5E5E]">
                {rejectionModal.rejectCategory}
              </span>
            </div>
 
            {/* 상세 내용 */}
            <div>
              <p className="text-[13px] text-[#6A7282] mb-1.5">상세 내용</p>
              <p className="text-[13.5px] text-[#1E2125] leading-relaxed border border-[#E5E7EB] rounded-lg px-4 py-3">
                {rejectionModal.rejectReason}
              </p>
            </div>
          </div>
        </div>
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