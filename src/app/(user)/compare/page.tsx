import FeatureHeader from '@/components/layout/FeatureHeader';
import ComapareForm from '@/features/user/compare/components/CompareForm';

export default function CourseComparePage() {
  return (
    <div className="bg-[#F9FAFB]">
      <FeatureHeader
        icon="compare"
        title="강의 한눈에 비교하기"
        description="관심 강의를 나란히 놓고 내용을 한눈에 비교해보세요."
        right=""
      />
      <div className="min-h-screen">
        <div className="max-w-275 mx-auto py-8 px-6">
            <ComapareForm />
        </div>
      </div>
    </div>
  );
}
