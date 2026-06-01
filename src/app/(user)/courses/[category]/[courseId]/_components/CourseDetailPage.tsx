import CourseCurriculum from '@/features/user/courses/components/CourseCurriculum';
import CourseReviews from '@/features/user/courses/components/CourseReviews';
import CourseDetailSidebar from '@/features/user/courses/components/CourseDetailSidebar';
import { CourseDetailFromAPI } from '@/features/user/courses/types';
import { MOCK_COURSE_DETAIL, Review, RatingDistribution } from '@/constants/mockCourseDetail';

interface CourseDetailPageProps {
  course: CourseDetailFromAPI;
}

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

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
}

// 목 필드 (추후 교체)
const MOCK_INSTRUCTOR = MOCK_COURSE_DETAIL.instructor;
const MOCK_NCS = MOCK_COURSE_DETAIL.ncs;
const MOCK_RATING_DISTRIBUTION: RatingDistribution[] = MOCK_COURSE_DETAIL.ratingDistribution;
const MOCK_REVIEWS: Review[] = MOCK_COURSE_DETAIL.reviews;

export default function CourseDetailPage({ course }: CourseDetailPageProps) {

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-275 mx-auto py-6 px-6">
        <div className="flex gap-10 items-start">
          {/* ── 좌측 메인 콘텐츠 ── */}
          <div className="flex flex-col flex-1 gap-4 min-w-0">
            {/* 첫번째 카드: 썸네일 + 브레드크럼 + 제목 + 평점 */}
            <div className={CARD + ' flex flex-col gap-4'}>
              {/* 썸네일: 추후 이미지 URL로 교체 */}
              <div
                className="rounded-t-xl -mx-6 -mt-6 bg-[#E5E7EB]"
                style={{ width: 'calc(100% + 3rem)', height: '240px' }}
              />

              {/* 카테고리 뱃지 */}
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 rounded-full bg-[#FFEBEB] text-[#FF5E5E] text-[12px] font-medium">
                  {course.categoryName}
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
                <StarRating rating={course.ratingAvg} />
                <span className="text-[#1E2125] text-[13.5px] font-semibold">
                  {course.ratingAvg.toFixed(1)}
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
                  {formatDuration(course.totalDuration)}시간
                </span>
              </div>
            </div>

            {/* NCS 정보 */}
            <section className={CARD}>
              <h2 className="text-[#1E2125] text-[17px] font-bold mb-3">NCS 정보</h2>
              <ul className="flex flex-col gap-1.5">
                {[MOCK_NCS.category, MOCK_NCS.competency, MOCK_NCS.code].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-[#1E2125]">
                    <span className="text-[#1E2125] mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* 커리큘럼 */}
            <section className={CARD}>
              <CourseCurriculum sessions={course.sessions} />
            </section>

            {/* 강사 정보 */}
            <section className={CARD}>
              <h2 className="text-[#1E2125] text-[17px] font-bold mb-4">강사 정보</h2>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] shrink-0 overflow-hidden" />
                <div className="flex flex-col gap-2">
                  <span className="text-[#1E2125] text-[15px] font-bold">
                    {course.instructorName}
                  </span>
                  <p className="text-[#6A7282] text-[13px] leading-relaxed">
                    {MOCK_INSTRUCTOR.bio}
                  </p>
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[#1E2125] text-[13px] font-semibold">
                      보유 자격증 및 경력
                    </span>
                    <ul className="flex flex-col gap-0.5">
                      {MOCK_INSTRUCTOR.careers.map((career) => (
                        <li key={career} className="text-[#6A7282] text-[13px]">
                          · {career}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 수강평 */}
            <section className={CARD}>
              <CourseReviews
                rating={course.ratingAvg}
                reviewCount={course.reviewCount}
                ratingDistribution={MOCK_RATING_DISTRIBUTION}
                reviews={MOCK_REVIEWS}
                isPurchased={false}
              />
            </section>
          </div>

          {/* ── 우측 구매 박스 ── */}
          <div className="w-72 shrink-0 sticky top-4">
            <CourseDetailSidebar course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
