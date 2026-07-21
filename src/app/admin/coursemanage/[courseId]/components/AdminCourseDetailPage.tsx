'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import CourseDetailContent from '@/features/user/courses/components/CourseDetailContent';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import CourseActionSlot from '@/features/user/courses/components/CourseActionSlot';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import { Category } from '@/features/categories/types';
import { resolveCourseViewOptions } from '@/lib/course-view-options';

interface AdminCourseDetailProps {
  course: CourseDetailFromAPI;
  categories: Category[];
}

const VALID_TABS = ['all', 'pending', 'rejected', 'private', 'category'] as const;
type Tab = (typeof VALID_TABS)[number];

export default function AdminCourseDetail({ course, categories }: AdminCourseDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromTab = searchParams.get('from');
  const backTab: Tab = VALID_TABS.includes(fromTab as Tab) ? (fromTab as Tab) : 'all';
  const backToListUrl =
    backTab === 'all' ? '/admin/coursemanage' : `/admin/coursemanage?tab=${backTab}`;

  const { showProgress, allSessionsPlayable, reviewMode, actionType } =
    resolveCourseViewOptions(course);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <button
          onClick={() => router.push(backToListUrl)}
          className="flex items-center gap-1 text-[13px] text-[#6A7282] hover:text-[#1E2125] cursor-pointer mb-4"
        >
          &lt; 강의 관리 목록
        </button>

        <div className="flex gap-10 items-start">
          <CourseDetailContent
            course={course}
            categories={categories}
            showProgress={showProgress}
            allSessionsPlayable={allSessionsPlayable}
            reviewMode={reviewMode}
          />
          <div className="w-72 shrink-0 sticky top-4 z-30">
            <CourseDetailSidebar
              course={course}
              actionSlot={<CourseActionSlot course={course} actionType={actionType} />}
              showPrice={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}