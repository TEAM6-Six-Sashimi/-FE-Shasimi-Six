'use client';

import { Button } from '@/components/ui/button';
import { CourseDetailFromAPI, EnrollmentInfo, DIFFICULTY_LABEL } from '../types';

interface CourseDetailSidebarOwnedProps {
  course: CourseDetailFromAPI;
  enrollmentInfo: EnrollmentInfo;
}

export default function CourseDetailSidebarOwned({ 
  course, enrollmentInfo
}: CourseDetailSidebarOwnedProps) {
  const lectureCount = course.sessions.length;
  const durationHours = Math.ceil(course.totalDuration / 3600);
  const difficultyLabel = DIFFICULTY_LABEL[course.difficulty] ?? course.difficulty;
  const progress = enrollmentInfo.progress;

  return (
    <div className="w-80 shrink-0 flex flex-col gap-3 bg-white rounded-xl shadow-md p-6">
      {/* 썸네일 */}
      <div className="w-full aspect-video rounded-xl bg-[#E5E7EB] overflow-hidden" />

      {/* 이어보기 버튼 */}
      <Button
        className="w-full h-11 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer"
        onClick={() => {
          // TODO: 강의 재생 페이지 연결
        }}
      >
        이어 보기
      </Button>

      {/* 수강률 게이지 바 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#6A7282]">수강률</span>
          <span className="text-[13px] font-semibold text-[#1E2125]">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#FF5E5E] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 강의 정보 */}
      <div className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2.5 mt-1">
        {[
          { label: '총 강의 수', value: `${lectureCount}강` },
          { label: '총 강의 시간', value: `${durationHours}시간` },
          { label: '난이도', value: difficultyLabel },
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