import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FitAnalysis, FitCategoryResult, FitStatus } from '../types';

interface FitAnalysisSectionProps {
  resumeBased: boolean;
  fitAnalysis: FitAnalysis | null;
}

// 적합도 상태 → 뱃지 색상/라벨
const FIT_STATUS_LABEL: Record<FitStatus, string> = {
  SATISFIED: '충족',
  PARTIALLY_SATISFIED: '일부 충족',
  NOT_SATISFIED: '미충족',
};

const FIT_STATUS_COLOR: Record<FitStatus, { bg: string; text: string }> = {
  SATISFIED: { bg: 'bg-[#F9FBE7]', text: 'text-[#827717]' },
  PARTIALLY_SATISFIED: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
  NOT_SATISFIED: { bg: 'bg-[#FFEBEB]', text: 'text-[#FF5E5E]' },
};

const CATEGORY_LABEL: Record<FitCategoryResult['category'], string> = {
  EDUCATION: '학력',
  CAREER: '경력',
  CERTIFICATION: '자격증',
};

// 한 카테고리(학력/경력/자격증) 카드 - resumeBased일 때만 사용
function FitCategoryCard({ result }: { result: FitCategoryResult }) {
  const { bg, text } = FIT_STATUS_COLOR[result.status];
  const isPositive = result.status === 'SATISFIED';

  return (
    <div className="flex-1 border border-[#E5E7EB] rounded-xl p-5 bg-white flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[15px] font-bold text-[#1E2125]">{CATEGORY_LABEL[result.category]}</h4>
        <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold ${bg} ${text}`}>
          {FIT_STATUS_LABEL[result.status]}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <p className="text-[12px] text-[#9CA3AF]">요구 조건</p>
          <p className="text-[13px] font-semibold text-[#1E2125]">{result.requiredCondition}</p>
        </div>
        <div>
          <p className="text-[12px] text-[#9CA3AF]">보유</p>
          <p className="text-[13px] font-semibold text-[#1E2125]">{result.userCondition}</p>
        </div>

        {result.category === 'CERTIFICATION' && result.missingItems.length > 0 && (
          <div className="pt-1">
            <p className="text-[12px] text-[#9CA3AF] mb-1">부족한 자격증</p>
            {result.missingItems.map((item) => (
              <p key={item} className="text-[13px] font-semibold text-[#FF5E5E]">
                · {item}
              </p>
            ))}
          </div>
        )}
      </div>

      <hr className="border-[#E5E7EB]" />

      <p
        className={`flex items-start gap-1.5 text-[12.5px] leading-relaxed ${
          isPositive ? 'text-[#5B8DEE]' : 'text-[#DC2626]'
        }`}
      >
        <span>{isPositive ? '✓' : '⚠'}</span>
        {result.comment}
      </p>
    </div>
  );
}

export default function FitAnalysisSection({ resumeBased, fitAnalysis }: FitAnalysisSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#1E2125] mb-5">
        <Image src="/ai-recommendation/goodness-active.svg" alt="" width={18} height={18} /> 공고
        적합도 분석
      </h2>

      {!resumeBased || !fitAnalysis ? (
        // 이력서가 없는 경우
        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <p className="text-[14.5px] text-[#6A7282]">
            이력서를 작성하면 역량 일치 정도를 확인할 수 있어요.
          </p>
          <Link href="/resume">
            <Button className="h-11 px-6 bg-[#FF5E5E] hover:bg-[#D14848] text-white font-semibold text-[14px] cursor-pointer">
              이력서 작성하고 오기
            </Button>
          </Link>
        </div>
      ) : (
        // 이력서가 있는 경우
        <div className="flex flex-col gap-5">
          <div className="flex gap-4">
            <FitCategoryCard result={fitAnalysis.education} />
            <FitCategoryCard result={fitAnalysis.career} />
            <FitCategoryCard result={fitAnalysis.certification} />
          </div>

          <div className="border border-[#E5E7EB] rounded-xl p-5 bg-[#F9FAFB]">
            <h4 className="text-[14px] font-bold text-[#1E2125] mb-3">AI 종합 분석 코멘트</h4>
            <div className="flex flex-col gap-2">
              {fitAnalysis.overallComments.map((comment, idx) => (
                <p
                  key={idx}
                  className="flex items-start gap-2 text-[13px] text-[#1E2125] leading-relaxed"
                >
                  <span>
                    {idx === 0 ? (
                      <Image src="/ai-recommendation/fit.svg" alt="" width={18} height={18} />
                    ) : idx === fitAnalysis.overallComments.length - 1 ? (
                      <Image src="/ai-recommendation/prefer.svg" alt="" width={18} height={18} />
                    ) : (
                      <Image src="/ai-recommendation/lack.svg" alt="" width={18} height={18} />
                    )}
                  </span>
                  {comment}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
