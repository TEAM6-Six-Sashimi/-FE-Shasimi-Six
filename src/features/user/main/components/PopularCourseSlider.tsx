'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CourseDetail, CourseFromAPI } from '../../courses/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PopularCourseSlider() {
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        // 전체 강의 조회
        const res = await fetch(`${API_BASE_URL}/api/courses`);

        if (!res.ok) {
          throw new Error('강의 목록 조회 실패');
        }

        const data: CourseFromAPI[] = await res.json();

        // 수강생 수 기준 상위 9개
        const topCourses = [...data].sort((a, b) => b.studentCount - a.studentCount).slice(0, 9);

        // 상세 조회 병렬 호출
        const detailedCourses = await Promise.all(
          topCourses.map(async (course) => {
            const detailRes = await fetch(`${API_BASE_URL}/api/courses/${course.courseId}`);

            if (!detailRes.ok) {
              throw new Error(`${course.courseId}번 강의 상세 조회 실패`);
            }

            const detail = await detailRes.json();

            console.log('thumbnail:', detail.thumbnail);

            return {
              ...course,
              categoryName: detail.categoryName,
            };
          }),
        );

        console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
        console.log('courses:', detailedCourses);

        setCourses(detailedCourses);
      } catch (error) {
        console.error('인기 강의 페칭 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  const slides = Array.from({ length: Math.ceil(courses.length / 3) }, (_, i) =>
    courses.slice(i * 3, i * 3 + 3),
  );

  const prev = () => setCurrent((p) => Math.max(0, p - 1));
  const next = () => setCurrent((p) => Math.min(slides.length - 1, p + 1));

  if (loading) {
    return (
      <section className="py-20">
        <div className="text-center text-[#6A7282]">인기 강의를 불러오는 중...</div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="py-20">
        <div className="text-center text-[#6A7282]">인기 강의가 없습니다.</div>
      </section>
    );
  }

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
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {slides.map((group, gIdx) => (
              <div key={gIdx} className="min-w-full grid grid-cols-3 gap-5">
                {group.map((course) => (
                  <div
                    key={course.courseId}
                    className="bg-white rounded-xl overflow-hidden border border-[#D1D5DB] hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="relative w-full aspect-video bg-[#E5E7EB]">
                      <img
                        src={
                          course.thumbnail?.startsWith('http')
                            ? course.thumbnail
                            : `http://localhost:8080/uploads/${course.thumbnail}`
                        }
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />

                      <span className="absolute top-3 right-3 bg-[#FF5E5E] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        인기
                      </span>
                    </div>

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
                          ({course.studentCount.toLocaleString()}
                          명)
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[#1E2125] text-[15px] font-bold">
                          {course.price.toLocaleString()} 크레딧
                        </p>

                        <Link
                          href={`/courses/${encodeURIComponent(
                            course.categoryName,
                          )}/${encodeURIComponent(course.title)}`}
                          className="px-4 py-1.5 rounded-lg border-2 border-[#1E2125] text-[12px] font-semibold text-[#1E2125] hover:bg-[#1E2125] hover:text-white transition-colors"
                        >
                          상세 보기
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#D1D5DB] shadow-md flex items-center justify-center text-[#1E2125] hover:bg-[#F9FAFB] disabled:opacity-30 transition-all cursor-pointer"
        >
          ‹
        </button>

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#D1D5DB] shadow-md flex items-center justify-center text-[#1E2125] hover:bg-[#F9FAFB] disabled:opacity-30 transition-all cursor-pointer"
        >
          ›
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        {slides.map((_, i) => (
          <button
            key={i}
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
