import FeatureCards from "@/features/user/main/components/FeatureCards";
import PopularCourseSlider from "@/features/user/main/components/PopularCourseSlider";

export default function MainPage() {
  return (
    <main className=" container mx-auto px-6 py-8">
      {/* 대표 기능 3가지 */}
      <FeatureCards />
      {/* 인기 강의 미리보기 */}
      <PopularCourseSlider />
    </main>
  );
}
