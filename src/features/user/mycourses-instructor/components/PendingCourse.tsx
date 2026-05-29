'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MOCK_INSTRUCTOR_COURSES, type CourseStatus } from '@/constants/mockInstructorCourses';
import Image from 'next/image';

type FilterType = '전체' | '대기' | '보관' | '반려';

const STATUS_LABEL: Record<CourseStatus, string> = {
  approved: '승인',
  pending: '대기',
  archived: '보관',
  rejected: '반려',
};

const STATUS_STYLE: Record<string, string> = {
  대기: 'bg-[#FEF3C7] text-[#92400E]',
  보관: 'bg-[#E5E7EB] text-[#6A7282]',
  반려: 'bg-[#FFEBEB] text-[#FF5E5E]',
};

export default function PendingCourse() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('전체');
  const [rejectionModal, setRejectionModal] = useState<string | null>(null);

  const pendingCourses = MOCK_INSTRUCTOR_COURSES.filter((c) => c.status !== 'approved');

  const filtered = pendingCourses.filter((c) => {
    const matchSearch = c.title.includes(search);
    const matchFilter =
      filter === '전체' ||
      (filter === '대기' && c.status === 'pending') ||
      (filter === '보관' && c.status === 'archived') ||
      (filter === '반려' && c.status === 'rejected');
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-4 min-h-[63vh]">
      {/* 검색 + 강의 신청 버튼 */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <div className="flex items-center gap-3">
            {/* 검색창 */}
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
          </div>
        </div>
        <Link href="/mycourses-instructor/new">
          <Button className="h-11 px-5 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[13px] font-semibold cursor-pointer shrink-0">
            + 강의 신청
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
        {pendingCourses.length === 0 ? (
          // 강의 자체가 없을 때
          <div className="flex flex-col items-center justify-center h-60 gap-3 text-[#6A7282]">
            <p className="text-[16px] font-medium">신청한 강의가 없습니다.</p>
          </div>
        ) : filtered.length === 0 ? (
          // 검색/필터 결과가 없을 때
          <div className="flex items-center justify-center h-40 text-[#6A7282] text-[16px] font-medium">
            해당하는 강의가 없습니다.
          </div>
        ) : (
          filtered.map((course) => {
            const statusLabel = STATUS_LABEL[course.status];
            const isPending = course.status === 'pending';
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-[#D1D5DB] px-5 py-4 flex items-center justify-between"
              >
                {/* 강의 정보 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11.5px] font-semibold ${STATUS_STYLE[statusLabel]}`}
                    >
                      {statusLabel}
                    </span>
                    {course.status === 'rejected' && (
                      <button
                        onClick={() => setRejectionModal(course.rejectionReason ?? '')}
                        className="text-[11.5px] text-[#FF5E5E] font-semibold underline cursor-pointer"
                      >
                        반려 사유 보기
                      </button>
                    )}
                  </div>
                  <p className="text-[14.5px] font-semibold text-[#1E2125]">{course.title}</p>
                  <p className="text-[12px] text-[#6A7282]">
                    {course.category} &gt; {course.subCategory}
                  </p>
                </div>

                {/* 가격 + 버튼 */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[15px] font-bold text-[#1E2125]">
                    {course.price.toLocaleString()}{' '}
                    <span className="text-[13px] font-normal text-[#6A7282]">크레딧</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {/* 수정 버튼 */}
                    {isPending ? (
                      <Button
                        size="sm"
                        disabled
                        className="h-9 px-4 text-[12.5px] font-semibold text-[#6A7282] bg-[#E5E7EB] cursor-not-allowed"
                      >
                        📝 수정
                      </Button>
                    ) : (
                      <Link href={`/mycourses-instructor/${course.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 border-[#D1D5DB] text-[#1E2125] text-[12.5px] font-semibold hover:bg-[#F9FAFB] cursor-pointer"
                        >
                          📝 수정
                        </Button>
                      </Link>
                    )}

                    {/* 삭제 버튼 */}
                    <Button
                      size="sm"
                      disabled={isPending}
                      className={`h-9 px-4 text-[12.5px] font-semibold transition-colors ${
                        isPending
                          ? 'text-[#6A7282] bg-[#E5E7EB] cursor-not-allowed'
                          : 'bg-[#FF5E5E] hover:bg-[#D14848] text-white cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!isPending) {
                          // TODO: 삭제 API 연결
                        }
                      }}
                    >
                      🗑 삭제
                    </Button>
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
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-bold text-[#1E2125]">반려 사유</h3>
            <p className="text-[13.5px] text-[#6A7282] leading-relaxed">{rejectionModal}</p>
            <Button
              onClick={() => setRejectionModal(null)}
              className="w-full h-10 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold cursor-pointer"
            >
              확인
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}