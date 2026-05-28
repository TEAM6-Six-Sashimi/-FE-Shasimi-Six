'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { ApprovedCourse as ApprovedCourseType } from '@/features/user/mycourses-instructor/types';
import type { Category } from '@/features/categories/types';

interface Props {
  courses: ApprovedCourseType[];
  categories: Category[];
}

export default function ApprovedCourse({ courses, categories }: Props) {
  const [search, setSearch] = useState('');

  const getCategoryName = (categoryId: number) => {
    for (const cat of categories) {
      if (cat.mainCategoryId === categoryId) return cat.name;
      const option = cat.options?.find((o) => o.id === categoryId);
      if (option) return `${cat.name} > ${option.name}`;
    }
    return String(categoryId);
  };

  const filtered = courses.filter((c) => c.title.includes(search));

  return (
    <div className="flex flex-col gap-6">
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
            + 강의 신청
          </Button>
        </Link>
      </div>

      {/* 강의 목록 */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[#6A7282] text-[14px]">
            승인된 강의가 없습니다.
          </div>
        ) : (
          filtered.map((course, index) => (
            <div
              key={course.courseId}
              className="bg-white rounded-xl border border-[#D1D5DB] px-5 py-4 flex items-center justify-between"
            >
              {/* 강의 정보 */}
              <div className="flex flex-col gap-1">
                <p className="text-[14.5px] font-semibold text-[#1E2125]">{course.title}</p>
                <p className="text-[12px] text-[#6A7282]">
                  {getCategoryName(course.categoryId)}
                </p>
                <div className="flex items-center gap-2 text-[12px] text-[#6A7282]">
                  <span className="text-[#FFD700]">★</span>
                  <span>{course.ratingAvg.toFixed(1)}</span>
                  <span>수강생 {course.studentCount.toLocaleString()}명</span>
                </div>
              </div>

              {/* 가격 + 버튼 */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-[15px] font-bold text-[#1E2125]">
                  {course.price.toLocaleString()}{' '}
                  <span className="text-[13px] font-normal text-[#6A7282]">크레딧</span>
                </span>
                <div className="flex items-center gap-2">
                  <Link href={`/mycourses-instructor/${course.courseId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 border-[#D1D5DB] text-[#1E2125] text-[12.5px] font-semibold hover:bg-[#F9FAFB] cursor-pointer"
                    >
                      상세보기
                    </Button>
                  </Link>
                  <Link href={`/mycourses-instructor/${course.courseId}/manage`}>
                    <Button
                      size="sm"
                      className="h-9 px-4 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] font-semibold cursor-pointer"
                    >
                      운영관리
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}