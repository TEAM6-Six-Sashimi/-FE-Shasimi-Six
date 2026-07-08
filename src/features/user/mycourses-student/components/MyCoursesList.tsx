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

  // 이어보기/다시보기: courseId로 이어볼 세션을 조회해서 player로 직행
  const handleContinueWatching = async (e: React.MouseEvent, course: StudentCourse) => {
    e.preventDefault();
    e.stopPropagation(); // 카드 전체를 감싼 Link로 전파되지 않도록
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
                  <div className="flex gap-5">
                    {/* 썸네일 - 카드 안쪽 여백 + 둥근 모서리 */}
                    <div className="relative w-44 h-28 shrink-0 rounded-lg overflow-hidden bg-[#E5E7EB]">
                      {thumbnailUrl && (
                        <Image
                          src={thumbnailUrl}
                          alt={course.title}
                          fill
                          unoptimized={isLocalhostUrl(thumbnailUrl)}
                          sizes="176px"
                          priority={idx === 0} // 첫 번째 카드만 priority
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* 우측 전체 */}
                    <div className="flex-1 flex flex-col">
                      {/* 상단: 강의 정보 + 버튼 */}
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                          <p className="text-[16px] font-extrabold text-[#1E2125] leading-snug mt-2">
                            {course.title}
                          </p>
                        </div>

                        {/* 버튼 */}
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          <Button
                            size="sm"
                            onClick={(e) => handleContinueWatching(e, course)}
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
                            onClick={(e) => handleWriteReview(e, course)}
                            className="h-9 px-4 border-[1.5px] border-[#1E2125] text-[#1E2125] text-[12.5px] font-semibold bg-white hover:bg-[#F9FAFB] cursor-pointer"
                          >
                            리뷰 작성
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[13.5px] font-bold text-[#6A7282]">
                          {course.instructorName}
                        </p>
                      </div>
                      {/* 학습 진행률 라벨 + 퍼센트 (같은 줄) */}
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
