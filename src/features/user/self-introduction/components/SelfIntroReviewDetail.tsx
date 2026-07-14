import Link from 'next/link';

interface SelfIntroReviewDetailProps {
  reviewId: number;
}

export default function SelfIntroReviewDetail({ reviewId }: SelfIntroReviewDetailProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-[#1E2125]">AI 첨삭 상세 결과</h2>
        <Link
          href="/ai-analysis?tab=self-intro"
          className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-[13px] font-semibold text-[#1E2125] hover:bg-[#F9FAFB] transition-colors"
        >
          나의 자기소개서 보기
        </Link>
      </div>

      <p className="text-[13px] text-[#6A7282]">
        자세한 첨삭 결과 화면을 준비 중입니다. (첨삭 ID: {reviewId})
      </p>
    </div>
  );
}
