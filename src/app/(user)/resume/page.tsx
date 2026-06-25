import FeatureHeader from '@/components/layout/FeatureHeader';
import ResumeBody from './components/resumeBody';

export default function ResumePage() {
  return (
    <div className='bg-[#F9FAFB]'>
      <FeatureHeader
        icon="ai"
        title="AI 이력서 작성 & 평가"
        description="템플릿으로 이력서를 작성하고 AI가 점수와 개선 방향까지 알려드립니다."
        right="1개월 플랜 / 갱신일 : 2026-07-12" // 연동해야됨
      />
          <ResumeBody />
    </div>
  );
}
