'use client';

import { JobPostingRecommendationResult } from '../types';
import { CourseFromAPI } from '../../courses/types';
import JobSummarySection from '../sections/JobsummarySection';
import FitAnalysisSection from '../sections/FitAnalysisSection';
import CertificateSection from '../sections/CertificateSection';
import CourseRecommendationSection from '../sections/CourseRecommendationSection';

interface RecomResultProps {
  result: JobPostingRecommendationResult;
  courseDetails: CourseFromAPI[];
}

export default function RecomResult({ result, courseDetails }: RecomResultProps) {
  const { summary, fitAnalysis, certificates, courses, resumeBased } = result;

  if (!summary) {
    return (
      <div className="flex flex-col gap-6 mt-6">
        <p className="text-center text-[13.5px] text-[#6A7282]">
          분석 결과를 표시할 수 없습니다.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* ===================== 채용 공고 요약 ===================== */}
      <JobSummarySection summary={summary} />

      {/* ===================== 공고 적합도 분석 ===================== */}
      <FitAnalysisSection resumeBased={resumeBased} fitAnalysis={fitAnalysis} />

      {/* ===================== 추천 자격증 ===================== */}
      <CertificateSection certificates={certificates ?? []} />

      {/* ===================== 추천 자격증 기반 강의 정보 ===================== */}
      <CourseRecommendationSection courses={courses ?? []} courseDetails={courseDetails} />

    </div>
  );
}
