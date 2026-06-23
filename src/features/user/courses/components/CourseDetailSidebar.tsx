import { ReactNode } from 'react';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import SidebarInfoBox, { SidebarThumbnail } from './sidebar-buttons/SidebarInfo';

interface CourseDetailSidebarProps {
  course: CourseDetailFromAPI;
  /** 썸네일 바로 아래, 강의정보 박스 위에 들어갈 버튼 영역 */
  actionSlot: ReactNode;
  /** 가격/크레딧 표시 여부 */
  showPrice?: boolean;
}

export default function CourseDetailSidebar({
  course,
  actionSlot,
  showPrice = true,
}: CourseDetailSidebarProps) {
  return (
    <div className="w-80 shrink-0 flex flex-col gap-3 bg-white rounded-xl shadow-md p-6">
      <SidebarThumbnail course={course} showPrice={showPrice} />
      {actionSlot}
      <SidebarInfoBox course={course} />
    </div>
  );
}