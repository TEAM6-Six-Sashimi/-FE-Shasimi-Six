'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { CourseDetail } from '@/constants/mockCourseDetail';

interface CourseDetailSidebarProps {
  course: CourseDetail;
}

export default function CourseDetailSidebar({ course }: CourseDetailSidebarProps) {
  return (
    <div className="w-80 shrink-0 flex flex-col gap-3 bg-white rounded-xl shadow-md p-6">
      {/* 썸네일 */}
      <div className="w-full aspect-video rounded-xl bg-[#E5E7EB] overflow-hidden" />

      {/* 가격 */}
      <p className="text-[#1E2125] text-[22px] font-bold">{course.price.toLocaleString()} 크레딧</p>

      {/* 구매하기 */}
      <Button
        className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
        onClick={() => {
          // TODO: 결제 페이지 연결
        }}
      >
        구매하기
      </Button>

      {/* 장바구니 */}
      <Button
        variant="outline"
        className="w-full h-11 border-[#D1D5DB] text-[#1E2125] font-semibold text-[14px] hover:bg-[#F9FAFB] cursor-pointer"
        onClick={() => {
          // TODO: 장바구니 기능 연결
        }}
      >
        <Image src="/header/cart.svg" width={17} height={17} alt=""/> 장바구니 담기
      </Button>

      {/* 강의 정보 */}
      <div className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2.5 mt-1">
        {[
          { label: '총 강의 수', value: `${course.lectureCount}강` },
          { label: '총 강의 시간', value: `${course.duration}시간` },
          { label: '난이도', value: course.level },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[#6A7282] text-[13px]">{label}</span>
            <span className="text-[#1E2125] text-[13px] font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
