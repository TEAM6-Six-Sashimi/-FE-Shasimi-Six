'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CourseFromAPI } from '../../courses/types';
import { getThumbnailUrl, isLocalhostUrl } from '@/lib/thumbnail';

interface CourseWithCategory extends CourseFromAPI {
  categoryName: string;
}

interface PopularCourseSliderClientProps {
  courses: CourseWithCategory[];
}

export default function PopularCourseSliderClient({ courses }: PopularCourseSliderClientProps) {
  const [current, setCurrent] = useState(0);

  const slides = Array.from({ length: Math.ceil(courses.length / 3) }, (_, i) =>
    courses.slice(i * 3, i * 3 + 3),
  );

  const prev = () => setCurrent((p) => Math.max(0, p - 1));
  const next = () => setCurrent((p) => Math.min(slides.length - 1, p + 1));

  return (
    <section className="py-20">
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-[#1E2125]">
          <span className="text-[#FF5E5E]">인기</span> 강의
        </h2>
        <p className="text-[13.5px] text-[#6A7282] mt-1">
          지금 가장 많이 수강하는 강의를 슬라이드로 만나보세요
        </p>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((group, gIdx) => (
              <div key={gIdx} className="min-w-full grid grid-cols-3 gap-5">
                {group.map((course) => {
                  const thumbnailUrl = getThumbnailUrl(course.thumbnail);
                  return (
                    <div
                      key={course.courseId}
                      className="bg-white rounded-xl overflow-hidden border border-[#D1D5DB] hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* 썸네일 */}
                      <div className="relative w-full aspect-video bg-[#E5E7EB]">
                        {thumbnailUrl && (
                          <Image
                            src={thumbnailUrl}
                            alt={course.title}
                            fill
                            unoptimized={isLocalhostUrl(thumbnailUrl)}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        )}
                        <span className="absolute top-3 right-3 bg-[#FF5E5E] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                          인기
                        </span>
                      </div>

                      {/* 강의 정보 */}
                      <div className="px-4 pt-3.5 pb-4 flex flex-col gap-1.5">
                        <p className="text-[#1E2125] text-[14px] font-semibold leading-snug line-clamp-2">
                          {course.title}
                        </p>
                        <p className="text-[#6A7282] text-[12px]">{course.instructorName}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[#FFD700] text-[12px]">★</span>
                          <span className="text-[#1E2125] text-[12px] font-semibold">
                            {course.ratingAvg.toFixed(1)}
                          </span>
                          <span className="text-[#6A7282] text-[11px]">
                            ({course.studentCount.toLocaleString()}명)
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-[#1E2125] text-[15px] font-bold">
                            {course.price.toLocaleString()} 크레딧
                          </p>
                          <Link
                            href={`/courses/${encodeURIComponent(course.categoryName)}/${course.courseId}`}
                            className="px-4 py-1.5 rounded-lg border-2 border-[#1E2125] text-[12px] font-semibold text-[#1E2125] hover:bg-[#1E2125] hover:text-white transition-colors"
                          >
                            상세 보기
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          aria-label="이전 슬라이드"
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#D1D5DB] shadow-md flex items-center justify-center text-[#1E2125] hover:bg-[#F9FAFB] disabled:opacity-30 transition-all cursor-pointer"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          disabled={current === slides.length - 1}
          aria-label="다음 슬라이드"
          className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#D1D5DB] shadow-md flex items-center justify-center text-[#1E2125] hover:bg-[#F9FAFB] disabled:opacity-30 transition-all cursor-pointer"
        >
          ›
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="슬라이드 페이지">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={current === i}
            aria-label={`${i + 1}번째 슬라이드`}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all cursor-pointer ${
              current === i ? 'w-6 h-2.5 bg-[#FF5E5E]' : 'w-2.5 h-2.5 bg-[#D1D5DB]'
            }`}
          />
        ))}
      </div>
    </section>
  );
}