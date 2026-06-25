import FeatureHeader from '@/components/layout/FeatureHeader';
import ResumeMain from '@/features/user/resume/components/ResumeMain';
import ResumeSidebar from '@/features/user/resume/components/ResumeSidebar';

export default function ResumePage() {
  return (
    <div className="bg-[#F9FAFB]">
      <FeatureHeader
        icon="ai"
        title="AI 이력서 작성 & 평가"
        description="템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다."
        right="1개월 플랜 / 갱신일 : 2026-07-12" // 연동해야됨
      />
      <div className="min-h-screen ">
        <div className="max-w-275 mx-auto py-6 px-6">
          <div className="flex gap-10 items-start">
            <div className="flex-1 min-w-0">
              <ResumeMain />
            </div>
            <div className="w-72 shrink-0 sticky top-4">
              <ResumeSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
