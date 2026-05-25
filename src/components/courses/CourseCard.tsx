'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/constants/mockCourses';

interface CourseCardProps {
  course: Course;
  category: string;
}

export default function CourseCard({ course, category }: CourseCardProps) {
  return (
    <div className="flex flex-col bg-[#F9FAFB] rounded-xl overflow-hidden border border-[#D1D5DB] hover:shadow-lg transition-shadow duration-200">
      {/* 썸네일 — 클릭 시 상세 이동 */}
      <Link
        href={`/courses/${encodeURIComponent(category)}/${course.id}`}
        className="relative aspect-video w-full block shrink-0"
      >
        {/* <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        /> */}
        <div className="w-full h-full bg-[#E5E7EB]" />
        {/* 뱃지 */}
        {course.badge && (
          <span
            className={`absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              course.badge === '인기' ? 'bg-[#FF5E5E] text-white' : 'bg-[#CFEE5D] text-[#1E2125]'
            }`}
          >
            {course.badge}
          </span>
        )}
      </Link>

      {/* 카드 본문 — 클릭 시 상세 이동 */}
      <Link
        href={`/courses/${encodeURIComponent(category)}/${course.id}`}
        className="flex flex-col gap-1.5 px-3.5 pt-3 pb-2 flex-1"
      >
        {/* 제목 */}
        <p className="text-[#1E2125] text-[13.5px] font-semibold leading-snug line-clamp-2">
          {course.title}
        </p>
        {/* 강사 */}
        <p className="text-[#6A7282] text-[12px]">{course.instructor}</p>
        {/* 평점 */}
        <div className="flex items-center gap-1">
          <span className="text-[#FFD700] text-[12px]">★</span>
          <span className="text-[#1E2125] text-[12px] font-semibold">
            {course.rating.toFixed(1)}
          </span>
          <span className="text-[#6A7282] text-[11px]">
            ({course.reviewCount.toLocaleString()})
          </span>
        </div>
        {/* 가격 */}
        <p className="text-[#1E2125] text-[14px] font-bold mt-auto">
          {course.price.toLocaleString()} 크레딧
        </p>
      </Link>

      {/* 버튼 영역 */}
      <div className="flex gap-2 px-3.5 pb-3.5">
        <Button
          size="sm"
          className="flex-1 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] font-semibold h-8 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            // TODO: 결제 페이지 연결
          }}
        >
          구매하기
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-[#D1D5DB] text-[#1E2125] text-[12.5px] font-semibold h-8 hover:bg-[#E5E7EB] cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            // TODO: 장바구니 기능 연결
          }}
        >
          장바구니
        </Button>
      </div>
    </div>
  );
}
