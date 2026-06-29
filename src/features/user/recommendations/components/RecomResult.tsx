// src/features/user/recommendations/components/RecomResult.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { JobPostingRecommendationResult, FitCategoryResult, FitStatus } from '../types';
import { CourseFromAPI } from '../../courses/types';

interface RecomResultProps {
  result: JobPostingRecommendationResult;
  courseDetails: CourseFromAPI[];
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

export default function RecomResult({ result, courseDetails }: RecomResultProps) {
  const { summary, fitAnalysis, certificates, courses, resumeBased } = result;

  // courseId 기준으로 courseDetails에서 빠르게 찾기 위한 맵
  const courseDetailMap = new Map(courseDetails.map((c) => [c.courseId, c]));

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* ===================== 1. 채용 공고 요약 ===================== */}
      <div className="bg-white rounded-2xl shadow-md p-8">
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
      </div>

      {/* ===================== 2. 공고 적합도 분석 ===================== */}
      <div className="bg-white rounded-2xl shadow-md p-8">
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
      </div>

      {/* ===================== 3. 추천 자격증 ===================== */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#1E2125] mb-1">
          <Image src="/ai-recommendation/certification-active.svg" alt="" width={18} height={18} />{' '}
          추천 자격증
        </h2>
        <p className="text-[12px] text-[#9CA3AF] mb-5">
          !! 다음 시험일은 자격증 시험의 필기 시험일 기준입니다 !!
        </p>

        <div className="grid grid-cols-3 gap-4">
          {certificates.map((cert, idx) => (
            <div key={idx} className="border border-[#E5E7EB] rounded-xl p-5 flex flex-col gap-2.5">
              <p className="text-[15px] font-bold text-[#1E2125]">{cert.name}</p>
              <span className="inline-block w-fit px-2.5 py-0.5 rounded-md bg-[#EEF4FF] font-semibold text-[12px] text-[#5B8DEE]">
                {cert.relatedSkills.join(' | ')}
              </span>

              <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-[#9CA3AF]">다음 시험일</span>
                  <span className="font-semibold text-[#1E2125]">{cert.nextExamDate}</span>
                </div>
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="text-[#9CA3AF]">접수 기간</span>
                  <span className="font-semibold text-[#1E2125]">
                    {cert.applicationStartDate} ~ {cert.applicationEndDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== 4. 추천 자격증 기반 강의 정보 ===================== */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-[#1E2125] mb-5">
          <Image src="/ai-recommendation/lectureinfo-active.svg" alt="" width={18} height={18} />{' '}
          추천 자격증 기반 강의 정보
        </h2>

        <div className="flex flex-col gap-3">
          {courses.map((course) => {
            const detail = courseDetailMap.get(course.courseId);

            return (
              <div
                key={course.courseId}
                className="flex items-center gap-4 border border-[#E5E7EB] rounded-xl p-4"
              >
                <div className="relative w-30 h-20 rounded-lg overflow-hidden bg-[#E5E7EB] shrink-0">
                  {detail?.thumbnail && (
                    <Image
                      src={detail.thumbnail}
                      alt={course.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14.5px] font-bold text-[#1E2125] truncate">{course.title}</p>
                  {detail?.instructorName && (
                    <p className="text-[12.5px] text-[#6A7282] mt-0.5">{detail.instructorName}</p>
                  )}
                  {detail?.categoryName && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#FFEBEB] text-[#FF5E5E] text-[11.5px] font-medium">
                      {detail.categoryName}
                    </span>
                  )}
                </div>
                <div className='pt-9'>
                  <Link
                    href={
                      detail?.categoryName
                        ? `/courses/${encodeURIComponent(detail.categoryName)}/${course.courseId}`
                        : `/courses/${course.courseId}`
                    }
                  >
                    <Button
                      variant="outline"
                      className="py-4 px-4 border-[#FF5E5E] text-[#FF5E5E] text-[12px] font-semibold hover:bg-[#FFEBEB] hover:text-[#FF5E5E] cursor-pointer shrink-0"
                    >
                      강의 바로가기
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
