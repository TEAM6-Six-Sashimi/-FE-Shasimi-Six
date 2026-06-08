import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StudentCourse } from '../types';
import Image from 'next/image';

interface Props {
  courses: StudentCourse[];
}

const progressColor = (completed: boolean) => (completed ? 'bg-[#CFEE5D]' : 'bg-[#FF5E5E]');

export default function MyCoursesList({ courses }: Props) {
  return (
    <div className="max-w-275 mx-auto px-6 py-8">
      <h1 className="text-[24px] font-bold text-[#1E2125] mb-6">내 강의</h1>

      <div className="flex flex-col gap-4">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3 text-[#6A7282]">
            <p className="text-[20px] font-medium">수강 중인 강의가 없습니다.</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden"
            >
              <div className="flex">
                {/* 썸네일 */}
                <div className="w-44 shrink-0 bg-[#E5E7EB]">
                  {course.thumbnail && (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* 우측 전체 */}
                <div className="flex-1 flex flex-col">
                  {/* 상단: 강의 정보 + 버튼 */}
                  <div className="flex items-start justify-between px-5 pt-4 pb-2">
                    <div className="flex flex-col gap-1">
                      <p className="text-[15px] font-bold text-[#1E2125] leading-snug">
                        {course.title}
                      </p>
                      <p className="text-[12.5px] text-[#6A7282]">{course.instructorName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11.5px] text-[#6A7282]">학습 진행률</span>
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
                    </div>

                    {/* 버튼 */}
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Link href={`/courses/detail/${course.courseId}`}>
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
                        className="h-9 px-4 border-[#D1D5DB] text-[#1E2125] text-[12.5px] hover:bg-[#F9FAFB] cursor-pointer"
                      >
                        리뷰 작성
                      </Button>
                    </div>
                  </div>

                  {/* 진행률 바 */}
                  <div className="px-5 pb-3 mt-auto">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progressColor(course.completed)}`}
                          style={{ width: `${course.progressRate}%` }}
                        />
                      </div>
                      <span
                        className={`text-[12px] font-semibold w-10 text-right shrink-0 ${
                          course.completed ? 'text-[#827717]' : 'text-[#FF5E5E]'
                        }`}
                      >
                        {course.progressRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
