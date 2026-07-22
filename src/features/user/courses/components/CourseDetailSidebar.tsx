import { ReactNode } from 'react';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import SidebarInfoBox, { SidebarThumbnail } from './sidebar-buttons/SidebarInfo';

interface CourseDetailSidebarProps {
  course: CourseDetailFromAPI;
  /** 버튼 영역 */
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
    <div className="w-full shrink-0 flex flex-col gap-3 bg-white rounded-xl shadow-md p-6">
      <SidebarThumbnail course={course} showPrice={showPrice} />
      {actionSlot}
      <hr className="mt-3 mb-2" />
      <SidebarInfoBox course={course} />
    </div>
  );
}
