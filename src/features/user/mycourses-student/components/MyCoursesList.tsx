'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StudentCourse } from '../types';
import { getResumeSessionAction } from '../actions';
import { getThumbnailUrl, isLocalhostUrl } from '@/lib/thumbnail';

interface Props {
  courses: StudentCourse[];
}

const progressColor = (completed: boolean) => (completed ? 'bg-[#CFEE5D]' : 'bg-[#FF5E5E]');

export default function MyCoursesList({ courses }: Props) {
  const router = useRouter();
  const [loadingCourseId, setLoadingCourseId] = useState<number | null>(null);

  const courseDetailHref = (course: StudentCourse) =>
    `/courses/${encodeURIComponent(course.categoryName)}/${course.courseId}`;

  // 이어보기/다시보기
  const handleContinueWatching = async (e: React.MouseEvent, course: StudentCourse) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingCourseId) return;

    setLoadingCourseId(course.courseId);
    try {
      const result = await getResumeSessionAction(course.courseId);
      if (!result) {
        router.push(courseDetailHref(course));
        return;
      }
      const query =
        result.lastPositionSeconds > 0
          ? `?courseId=${course.courseId}&t=${result.lastPositionSeconds}`
          : `?courseId=${course.courseId}`;
      router.push(`/player/${result.sessionId}${query}`);
    } finally {
      setLoadingCourseId(null);
    }
  };

  // 리뷰 작성: 강의 상세 페이지의 수강평 섹션으로 이동
  const handleWriteReview = (e: React.MouseEvent, course: StudentCourse) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`${courseDetailHref(course)}#course-reviews`);
  };

  return (
    <div className="max-w-275 mx-auto px-6 py-8">
      <h1 className="text-[24px] font-bold text-[#1E2125] mb-6">내 강의</h1>

      <div className="flex flex-col gap-5">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3 text-[#6A7282]">
            <p className="text-[20px] font-medium">수강 중인 강의가 없습니다.</p>
          </div>
        ) : (
          courses.map((course, idx) => {
            const thumbnailUrl = getThumbnailUrl(course.thumbnail);
            const isLoading = loadingCourseId === course.courseId;

            return (
              <div
                key={course.courseId}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5"
              >
                <Link href={courseDetailHref(course)}>
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* 썸네일 */}
                    <div className="relative w-full h-40 sm:w-44 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-[#E5E7EB]">
                      {thumbnailUrl && (
                        <Image
                          src={thumbnailUrl}
                          alt={course.title}
                          fill
                          unoptimized={isLocalhostUrl(thumbnailUrl)}
                          sizes="(max-width: 640px) 100vw, 176px"
                          priority={idx === 0}
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* 우측 전체 */}
                    <div className="flex-1 flex flex-col min-w-0">
                      {/* 상단: 강의 정보 + 버튼(데스크톱) */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="text-[16px] font-extrabold text-[#1E2125] leading-snug mt-2">
                            {course.title}
                          </p>
                        </div>

                        {/* 버튼(데스크톱: 제목 옆) */}
                        <div className="hidden sm:flex items-center gap-2 shrink-0 sm:ml-4">
                          <CourseActionButtons
                            course={course}
                            isLoading={isLoading}
                            onContinueWatching={handleContinueWatching}
                            onWriteReview={handleWriteReview}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-[13.5px] font-bold text-[#6A7282]">
                          {course.instructorName}
                        </p>
                      </div>
                      {/* 학습 진행률 라벨 + 퍼센트 */}
                      <div className="flex-1 flex flex-col justify-end mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold text-[#6A7282]">
                              학습 진행률
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                course.completed
                                  ? 'bg-[#F9FBE7] text-[#827717]'
                                  : 'bg-[#FFEBEB] text-[#FF5E5E]'
                              }`}
                            >
                              {course.completed ? '완강' : '수강중'}
                            </span>
                          </div>
                          <span className="text-[13px] font-bold text-[#6A7282]">
                            {course.progressRate}%
                          </span>
                        </div>
                        {/* 진행률 바 */}
                        <div className="h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progressColor(course.completed)}`}
                            style={{ width: `${course.progressRate}%` }}
                          />
                        </div>
                      </div>

                      {/* 버튼(모바일: 진행률 아래) */}
                      <div className="flex sm:hidden items-center gap-2 mt-3 justify-end">
                        <CourseActionButtons
                          course={course}
                          isLoading={isLoading}
                          onContinueWatching={handleContinueWatching}
                          onWriteReview={handleWriteReview}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CourseActionButtons({
  course,
  isLoading,
  onContinueWatching,
  onWriteReview,
}: {
  course: StudentCourse;
  isLoading: boolean;
  onContinueWatching: (e: React.MouseEvent, course: StudentCourse) => void;
  onWriteReview: (e: React.MouseEvent, course: StudentCourse) => void;
}) {
  return (
    <>
      <Button
        size="sm"
        onClick={(e) => onContinueWatching(e, course)}
        disabled={isLoading}
        className="h-9 px-4 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] font-semibold cursor-pointer disabled:opacity-70"
      >
        {isLoading
          ? '이동 중...'
          : course.completed
            ? '다시보기 >'
            : course.progressRate > 0
              ? '이어보기 >'
              : '수강하기 >'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => onWriteReview(e, course)}
        className="h-9 px-4 border-[1.5px] border-[#1E2125] text-[#1E2125] text-[12.5px] font-semibold bg-white hover:bg-[#F9FAFB] cursor-pointer"
      >
        리뷰 작성
      </Button>
    </>
  );
}
