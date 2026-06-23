'use client';

import { CourseDetailFromAPI, EnrollmentInfo } from '@/features/user/courses/types';
import { Category } from '@/features/categories/types';
import CourseHeaderSection from './sections/CourseHeaderSection';
import CourseTabNav, { CourseTabKey, SECTION_ID } from './sections/CourseTabNav';
import CourseCurriculumSection from './sections/CourseCurriculumSection';
import CourseInstructorSection, { InstructorInfo } from './sections/CourseInstructorSection';
import CourseReviewsSection from './sections/CourseReviews';
import { MOCK_COURSE_DETAIL, Review, RatingDistribution } from '@/constants/mockCourseDetail';

// 목업 (추후 API 연동 시 course 응답에서 교체)
const MOCK_INSTRUCTOR: InstructorInfo = MOCK_COURSE_DETAIL.instructor;
const MOCK_RATING_DISTRIBUTION: RatingDistribution[] = MOCK_COURSE_DETAIL.ratingDistribution;
const MOCK_REVIEWS: Review[] = MOCK_COURSE_DETAIL.reviews;

interface CourseDetailContentProps {
  course: CourseDetailFromAPI;
  /** 노출할 탭 목록. 수강평 탭을 빼고 싶으면 ['curriculum', 'instructor']만 전달 */
  categories: Category[];
  /** 노출할 탭 목록. 수강평 탭을 빼고 싶으면 ['curriculum', 'instructor']만 전달 */
  tabs: CourseTabKey[];
  /** 커리큘럼 진행률바 표시 여부 - 구매한 학생만 true */
  showProgress: boolean;
  /** 커리큘럼 전체 세션 재생 가능 여부 - 미구매 일반 사용자만 false */
  allSessionsPlayable: boolean;
  /** 구매한 학생일 때 진행률 계산용 (선택) */
  enrollmentInfo?: EnrollmentInfo;
  /** 수강평 작성 폼 노출 여부 - 구매한 학생만 true */
  canWriteReview: boolean;
}

export default function CourseDetailContent({
  course,
  tabs,
  showProgress,
  allSessionsPlayable,
  canWriteReview,
  categories
}: CourseDetailContentProps) {

  // 세션별 진행률 - 현재 백엔드는 전체 진행률(progress)만 제공.
  // 세션별 진행률 API가 추가되면 이 부분을 실제 맵으로 교체.
  const progressMap = {};

  return (
    <div className="flex flex-col flex-1 gap-4 min-w-0">
      <CourseHeaderSection course={course} categories={categories} />
 
      {/* 리모컨 - 클릭 시 아래 섹션들로 스크롤 이동 */}
      <CourseTabNav tabs={tabs} />
 
      {/* 모든 섹션이 세로로 순서대로 펼쳐짐 */}
      <section id={SECTION_ID.curriculum} className="bg-white rounded-xl shadow-md p-6">
        <CourseCurriculumSection
          courseId={course.courseId}
          sessions={course.sessions}
          showProgress={showProgress}
          progressMap={progressMap}
          allSessionsPlayable={allSessionsPlayable}
        />
      </section>
 
      <section id={SECTION_ID.instructor} className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-[#1E2125] text-[17px] font-bold mb-4">강사 정보</h2>
        <CourseInstructorSection
          instructorName={course.instructorName}
          instructor={MOCK_INSTRUCTOR}
        />
      </section>
 
      {tabs.includes('reviews') && (
        <section id={SECTION_ID.reviews} className="bg-white rounded-xl shadow-md p-6">
          <CourseReviewsSection
            rating={course.ratingAvg}
            reviewCount={course.reviewCount}
            ratingDistribution={MOCK_RATING_DISTRIBUTION}
            reviews={MOCK_REVIEWS}
            isPurchased={canWriteReview}
          />
        </section>
      )}
    </div>
  );
}