import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StudentCourse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  courses: StudentCourse[];
}

function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
}

const progressColor = (completed: boolean) => (completed ? 'bg-[#CFEE5D]' : 'bg-[#FF5E5E]');

export default function MyCoursesList({ courses }: Props) {
  return (
    <div className="max-w-275 mx-auto px-6 py-8">
      <h1 className="text-[24px] font-bold text-[#1E2125] mb-6">내 강의</h1>

      <div className="flex flex-col gap-5">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3 text-[#6A7282]">
            <p className="text-[20px] font-medium">수강 중인 강의가 없습니다.</p>
          </div>
        ) : (
          courses.map((course) => {
            const thumbnailUrl = getThumbnailUrl(course.thumbnail);
            return (
              <div
                key={course.courseId}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5"
              >
                <div className="flex gap-5">
                  {/* 썸네일 - 카드 안쪽 여백 + 둥근 모서리 */}
                  <div className="relative w-44 h-28 shrink-0 rounded-lg overflow-hidden bg-[#E5E7EB]">
                    {thumbnailUrl && (
                      <Image
                        src={thumbnailUrl}
                        alt={course.title}
                        fill
                        unoptimized
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
                        <Link href={`/mycourses-student/${course.courseId}`}>
                          <Button
                            size="sm"
                            className="h-9 px-4 bg-[#FF5E5E] hover:bg-[#D14848] text-white text-[12.5px] font-semibold cursor-pointer"
                          >
                            {course.completed ? '다시보기 >' : '이어보기 >'}
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 border-[1.5px] border-[#1E2125] text-[#1E2125] text-[12.5px] font-semibold bg-white hover:bg-[#F9FAFB] cursor-pointer"
                        >
                          리뷰 작성
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-[13.5px] font-bold text-[#6A7282]">{course.instructorName}</p>
                    </div>
                    {/* 학습 진행률 라벨 + 퍼센트 (같은 줄) */}
                    <div className="flex-1 flex flex-col justify-end mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-[#6A7282]">학습 진행률</span>
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
                        <span
                          className="text-[13px] font-bold text-[#6A7282]"
                        >
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
