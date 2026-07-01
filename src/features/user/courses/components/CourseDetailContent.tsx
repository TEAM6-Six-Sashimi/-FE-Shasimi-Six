'use client';

import { CourseDetailFromAPI, ReviewMode } from '@/features/user/courses/types';
import { Category } from '@/features/categories/types';
import CourseHeaderSection from './sections/CourseHeaderSection';
import CourseNcsSection from './sections/CourseNcsSection';
import CourseTabNav, { SECTION_ID } from './sections/CourseTabNav';
import CourseCurriculumSection from './sections/CourseCurriculumSection';
import CourseInstructorSection from './sections/CourseInstructorSection';
import CourseReviewsSection from './sections/CourseReviews';

interface CourseDetailContentProps {
  course: CourseDetailFromAPI;
  categories: Category[];
  /** 커리큘럼 진행률바 표시 여부 - 구매한 학생(ENROLLED)만 true */
  showProgress: boolean;
  /** 커리큘럼 전체 세션 재생 가능 여부 - PUBLIC(미구매)만 false */
  allSessionsPlayable: boolean;
  /** 수강평 모드 */
  reviewMode: ReviewMode;
  /** 현재 로그인한 사용자의 loginId - 본인 리뷰 판별용 */
  currentUserLoginId?: string | null;
}

export default function CourseDetailContent({
  course,
  showProgress,
  allSessionsPlayable,
  reviewMode,
  categories,
  currentUserLoginId,
}: CourseDetailContentProps) {
  return (
    <div className="flex flex-col flex-1 gap-4 min-w-0">
      <CourseHeaderSection course={course} categories={categories} />

      <CourseNcsSection ncs={course.ncs} />

      {/* 리모컨 */}
      <CourseTabNav />

      {/* 모든 섹션이 세로로 순서대로 펼쳐짐 */}
      <section id={SECTION_ID.curriculum} className="bg-white rounded-xl shadow-md p-6">
        <CourseCurriculumSection
          courseId={course.courseId}
          sessions={course.sessions}
          showProgress={showProgress}
          allSessionsPlayable={allSessionsPlayable}
        />
      </section>

      <section id={SECTION_ID.instructor} className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-[#1E2125] text-[17px] font-bold mb-4">강사 정보</h2>
        <CourseInstructorSection
          instructorName={course.instructor.name}
          instructor={course.instructor}
        />
      </section>

      <section id={SECTION_ID.reviews} className="bg-white rounded-xl shadow-md p-6">
        <CourseReviewsSection
          courseId={course.courseId}
          rating={course.ratingAvg}
          reviewCount={course.reviewCount}
          ratingDistribution={course.ratingDistribution}
          reviews={course.reviews}
          reviewMode={reviewMode}
          currentUserLoginId={currentUserLoginId}
        />
      </section>
    </div>
  );
}
