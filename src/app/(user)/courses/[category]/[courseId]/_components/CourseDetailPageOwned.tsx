import CourseCurriculumOwned from '@/features/user/courses/components/CourseCurriculumOwned';
import CourseReviews from '@/features/user/courses/components/CourseReviews';
import CourseDetailSidebarOwned from '@/features/user/courses/components/CourseDetailSidebarOwned';
import { MOCK_COURSE_DETAIL } from '@/constants/mockCourseDetail';

const CARD = 'bg-white rounded-xl shadow-md p-6 overflow-hidden';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`text-[16px] ${star <= Math.round(rating) ? 'text-[#FFD700]' : 'text-[#D1D5DB]'}`}
      >
        ★
      </span>
    ))}
  </div>
);

export default function CourseDetailPageOwned() {
  const course = MOCK_COURSE_DETAIL;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          {/* ── 좌측 메인 콘텐츠 ── */}
          <div className="flex flex-col flex-1 gap-4 min-w-0">
            {/* 첫번째 카드: 썸네일 + 브레드크럼 + 제목 + 평점 */}
            <div className={CARD + ' flex flex-col gap-4'}>
              {/* 썸네일 */}
              <div
                className="rounded-t-xl -mx-6 -mt-6 bg-[#E5E7EB]"
                style={{ width: 'calc(100% + 3rem)', height: '240px' }}
              />

              {/* 브레드크럼 — 뱃지 스타일 */}
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-full bg-[#FFEBEB] text-[#FF5E5E] text-[12px] font-medium">
                  {course.category}
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#F9FBE7] text-[#827717] text-[12px] font-medium">
                  {course.subCategory}
                </div>
              </div>

              {/* 제목 + 설명 */}
              <div className="flex flex-col gap-1.5">
                <h1 className="text-[#1E2125] text-[22px] font-bold leading-snug">
                  {course.title}
                </h1>
                <p className="text-[#6A7282] text-[13.5px]">{course.description}</p>
              </div>

              {/* 평점 */}
              <div className="flex items-center gap-1.5">
                <StarRating rating={course.rating} />
                <span className="text-[#1E2125] text-[13.5px] font-semibold">
                  {course.rating.toFixed(1)}
                </span>
                <span className="text-[#6A7282] text-[13px]">
                  ({course.reviewCount.toLocaleString()}개의 리뷰)
                </span>
              </div>

              {/* 수강생 + 시간 + 업데이트 */}
              <div className="flex items-center gap-4 text-[13px] text-[#6A7282]">
                <span className="flex items-center gap-1.5">
                  <span>👤</span>
                  {course.studentCount.toLocaleString()}명 수강
                </span>
                <span className="flex items-center gap-1.5">
                  <span>⏱</span>
                  {course.duration}시간
                </span>
                <span className="flex items-center gap-1.5">
                  <span>📅</span>
                  {course.updatedAt}
                </span>
              </div>
            </div>

            {/* NCS 정보 */}
            <section className={CARD}>
              <h2 className="text-[#1E2125] text-[17px] font-bold mb-3">NCS 정보</h2>
              <ul className="flex flex-col gap-1.5">
                {[course.ncs.category, course.ncs.competency, course.ncs.code].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-[#1E2125]">
                    <span className="text-[#1E2125] mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 커리큘럼 (구매 후 - 재생 + 진행률) */}
            <section className={CARD}>
              <CourseCurriculumOwned curriculum={course.curriculum} />
            </section>

            {/* 강사 정보 */}
            <section className={CARD}>
              <h2 className="text-[#1E2125] text-[17px] font-bold mb-4">강사 정보</h2>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] shrink-0 overflow-hidden" />
                <div className="flex flex-col gap-2">
                  <span className="text-[#1E2125] text-[15px] font-bold">
                    {course.instructor.name}
                  </span>
                  <p className="text-[#6A7282] text-[13px] leading-relaxed">
                    {course.instructor.bio}
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[#1E2125] text-[13px] font-semibold">
                      보유 자격증 및 경력
                    </span>
                    <ul className="flex flex-col gap-0.5">
                      {course.instructor.careers.map((career) => (
                        <li key={career} className="text-[#6A7282] text-[13px]">
                          · {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 수강평 + 수강평 작성하기 */}
            <section id="reviews" className={CARD}>
              <CourseReviews
                rating={course.rating}
                reviewCount={course.reviewCount}
                ratingDistribution={course.ratingDistribution}
                reviews={course.reviews}
                isPurchased={true}
              />
            </section>
          </div>

          {/* ── 우측 사이드바 (구매 후) ── */}
          <div className="w-72 shrink-0">
            <CourseDetailSidebarOwned
              course={{
                lectureCount: course.lectureCount,
                duration: course.duration,
                level: course.level,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}