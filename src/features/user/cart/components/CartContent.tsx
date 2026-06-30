'use client';

import Image from 'next/image';
import { CartCourseItem } from '../types';
import { Button } from '@/components/ui/button';
import { getThumbnailUrl, isLocalhostUrl } from '@/lib/thumbnail';

interface CartContentProps {
  items: CartCourseItem[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleAll: () => void;
  onDeleteSelected: () => void;
}

export default function CartContent({
  items,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onDeleteSelected,
}: CartContentProps) {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div>
      <h1 className="text-[27px] font-bold mt-2 mb-8">장바구니</h1>

      {/* 전체선택 / 선택삭제 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E7EB]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={onToggleAll}
            className={`w-5 h-5 rounded flex items-center justify-center border-[1.5px] transition-colors cursor-pointer
                            ${
                              isAllSelected
                                ? 'bg-[#FF5E5E] border-[#FF5E5E]'
                                : 'bg-white border-[#D1D5DB] hover:border-[#FF5E5E]'
                            }`}
          >
            {isAllSelected && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path
                  d="M1 4L4 7L10 1"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-[14px] font-medium text-[#1E2125]">전체 선택</span>
        </label>

        <Button
          type="button"
          onClick={onDeleteSelected}
          disabled={selectedIds.length === 0}
          className={`flex items-center gap-1.5 px-3 py-1.5 h-auto text-[13px] font-medium cursor-pointer ${
            selectedIds.length > 0
              ? 'bg-[#FF5E5E] text-white hover:bg-[#D14848]'
              : 'bg-[#E5E7EB] text-[#6A7282] hover:bg-[#E5E7EB] cursor-not-allowed'
          }`}
        >
          <svg width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path
              d="M1 3.5H12M4.5 3.5V2.5C4.5 1.948 4.948 1.5 5.5 1.5H7.5C8.052 1.5 8.5 1.948 8.5 2.5V3.5M5.5 6.5V10.5M7.5 6.5V10.5M2.5 3.5L3 11.5C3 12.052 3.448 12.5 4 12.5H9C9.552 12.5 10 12.052 10 11.5L10.5 3.5H2.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          선택 삭제
        </Button>
      </div>

      {/* 장바구니 아이템 목록 */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#6A7282]">
          <p className="text-[15px]">장바구니가 비어 있어요.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.courseId);
            const thumbnailUrl = getThumbnailUrl(item.thumbnail);
            return (
              <div
                key={item.courseId}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors
                                    ${isSelected ? 'border-[#6A7282]' : 'border-[#E5E7EB] bg-white'}`}
              >
                {/* 체크박스 */}
                <div
                  onClick={() => onToggleSelect(item.courseId)}
                  className={`w-5 h-5 shrink-0 rounded border-[1.5px] flex items-center justify-center transition-colors cursor-pointer
                                    ${
                                      isSelected
                                        ? 'bg-[#FF5E5E] border-[#FF5E5E]'
                                        : 'bg-white border-[#D1D5DB] hover:border-[#FF5E5E]'
                                    }`}
                >
                  {isSelected && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path
                        d="M1 4L4 7L10 1"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* 썸네일 */}
                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-[#D1D5DB]">
                  {thumbnailUrl && (
                    <Image
                      src={thumbnailUrl}
                      alt={item.title}
                      fill
                      unoptimized={isLocalhostUrl(thumbnailUrl)}
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* 강의 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#1E2125] truncate">{item.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[12px] text-[#6A7282]">{item.instructorName}</span>
                  </div>
                </div>

                {/* 가격 */}
                <div className="shrink-0">
                  <span className="text-[17px] font-bold text-[#FF5E5E]">
                    {item.price.toLocaleString()} 크레딧
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
