'use client';

interface PaginationProps {
  currentPage: number; // 1-indexed
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGE_WINDOW_SIZE = 5;

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // currentPage가 totalPages보다 큰 경우(필터링 등으로 목록이 줄었을 때)를 대비한 방어 처리
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  // 한 번에 5페이지씩만 보여주고, 그 구간을 벗어나면 다음/이전 구간으로 넘어감
  const windowStart = Math.floor((safePage - 1) / PAGE_WINDOW_SIZE) * PAGE_WINDOW_SIZE + 1;
  const windowEnd = Math.min(windowStart + PAGE_WINDOW_SIZE - 1, totalPages);

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
      >
        이전
      </button>
      {Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i).map(
        (page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
              currentPage === page
                ? 'bg-[#1E2125] text-white'
                : 'text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
            }`}
          >
            {page}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
      >
        다음
      </button>
    </div>
  );
}
