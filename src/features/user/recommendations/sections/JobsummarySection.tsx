import Image from "next/image";
import { JobPostingSummary } from "../types";

interface JobSummarySectionProps {
    summary: JobPostingSummary;
}

export default function JobSummarySection({ summary }: JobSummarySectionProps) {
    return (
        <section className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#1E2125] mb-5">
          <Image src="/ai-recommendation/text-active.svg" alt="" width={18} height={18} />
          채용 공고 요약
        </h2>

        <div className="grid grid-cols-2 gap-8">
          {/* 좌측: 직무/경력조건/주요업무 */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[12.5px] text-[#9CA3AF] mb-1">직무</p>
              <p className="text-[16px] font-bold text-[#1E2125]">{summary.jobRole}</p>
            </div>
            <div>
              <p className="text-[12.5px] text-[#9CA3AF] mb-1.5">경력 조건</p>
              <span className="inline-block px-3 py-1 rounded-full bg-[#EEF4FF] text-[13px] font-semibold text-[#5B8DEE]">
                {summary.experienceRequirement}
              </span>
            </div>
            <div>
              <p className="text-[12.5px] text-[#9CA3AF] mb-1">주요 업무</p>
              <p className="text-[13px] text-[#1E2125] leading-relaxed">
                {summary.mainTaskSummary}
              </p>
            </div>
          </div>

          {/* 우측: 필수/우대사항 */}
          <div className="flex flex-col gap-4 border-l border-[#E5E7EB] pl-8">
            <div>
              <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-[#1E2125] mb-2">
                <span className="text-[#FFD700]">★</span> 필수사항
              </p>
              <ul className="flex flex-col gap-1">
                {summary.requiredQualifications.map((q) => (
                  <li key={q} className="text-[13px] text-[#1E2125] flex items-start gap-1.5">
                    <span className="text-[#6A7282] mt-0.5">•</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-[#E5E7EB]" />

            <div>
              <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-[#1E2125] mb-2">
                <span className="text-[#FFD700]">☆</span> 우대사항
              </p>
              <ul className="flex flex-col gap-1">
                {summary.preferredQualifications.map((q) => (
                  <li key={q} className="text-[13px] text-[#1E2125] flex items-start gap-1.5">
                    <span className="text-[#6A7282] mt-0.5">•</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
}