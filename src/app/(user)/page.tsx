import FeatureCards from '@/features/user/main/components/FeatureCards';
import NoticePreviewList from '@/features/user/main/components/NoticePreviewList';
import PopularCourseSlider from '@/features/user/main/components/PopularCourseSlider';
import CareerCounselingButton from '@/features/user/main/components/CareerCounselingButton';

export default function MainPage() {
  return (
    <main className="flex flex-col w-full max-w-340 mx-auto px-10 py-8">
      {/* 대표 기능 3가지 */}
      <div className="max-w-275 mx-auto w-full">
        <FeatureCards />
      </div>
      {/* 공지사항 미리보기 */}
      <NoticePreviewList />
      {/* 인기 강의 미리보기 */}
      <PopularCourseSlider />
      {/* 진로 상담 챗봇 버튼 */}
      <CareerCounselingButton />
    </main>
  );
}
