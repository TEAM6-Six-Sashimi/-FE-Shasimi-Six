'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CourseDetailSidebarInstructorProps {
  courseId: number;
  course: {
    lectureCount: number;
    duration: number;
    level: string;
  };
}

export default function CourseDetailSidebarInstructor({
  courseId,
  course,
}: CourseDetailSidebarInstructorProps) {
  return (
    <div className="w-80 shrink-0 flex flex-col gap-3 bg-white rounded-xl shadow-md p-6">
      {/* 썸네일 */}
      <div className="w-full aspect-video rounded-xl bg-[#E5E7EB] overflow-hidden" />

      {/* 수정하기 버튼 */}
      <Link href={`/mycourses-instructor/${courseId}/edit`}>
        <Button className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer">
          수정하기
        </Button>
      </Link>

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