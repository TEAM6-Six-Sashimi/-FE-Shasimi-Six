import FeatureCards from '@/features/user/main/components/FeatureCards';
import PopularCourseSlider from '@/features/user/main/components/PopularCourseSlider';

export default function MainPage() {
  return (
    <main className="flex flex-col w-full max-w-340 mx-auto px-10 py-8">
      {/* 대표 기능 3가지 */}
      <div className='max-w-275 mx-auto w-full'>
      <FeatureCards />
      </div>
      <div>
        {/* 인기 강의 미리보기 */}
        <PopularCourseSlider />
      </div>
    </main>
  );
}
