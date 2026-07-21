import Image from 'next/image';
import { RecommendedCertificate } from '../types';

interface CertificateSectionProps {
  certificates: RecommendedCertificate[];
}

// 오늘 날짜 기준 D-day 계산 (YYYY-MM-DD 형식 입력)
function calculateDDay(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'D-Day';
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}

export default function CertificateSection({ certificates }: CertificateSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#1E2125] mb-1">
        <Image src="/ai-recommendation/certification-active.svg" alt="" width={18} height={18} />{' '}
        추천 자격증
      </h2>
      <p className="text-[12px] text-[#9CA3AF] mb-5">
        !! 다음 시험일은 자격증 시험의 필기 시험일 기준입니다 !!
      </p>

      {certificates.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-[#9CA3AF]">
          추천할 자격증 정보가 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {certificates.map((cert, idx) => {
            const hasExamDate = !!cert.nextExamDate;
            const hasApplicationPeriod = !!cert.applicationStartDate && !!cert.applicationEndDate;

            return (
              <div
                key={idx}
                className="border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-2.5"
              >
                <p className="text-[15px] font-bold text-[#1E2125]">{cert.name}</p>
                <span className="inline-block w-fit px-2.5 py-0.5 rounded-md bg-[#EEF4FF] font-semibold text-[12px] text-[#5B8DEE]">
                  {cert.relatedSkills.join(' | ')}
                </span>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-[#9CA3AF]">다음 시험일</span>
                    {hasExamDate ? (
                      <span className="font-semibold text-[#1E2125]">
                        {cert.nextExamDate} ({calculateDDay(cert.nextExamDate)})
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF]">시험 일정 정보가 없습니다.</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-[#9CA3AF]">접수 기간</span>
                    {hasApplicationPeriod ? (
                      <span className="font-semibold text-[#1E2125]">
                        {cert.applicationStartDate} ~ {cert.applicationEndDate}
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF]">시험 일정 정보가 없습니다.</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
