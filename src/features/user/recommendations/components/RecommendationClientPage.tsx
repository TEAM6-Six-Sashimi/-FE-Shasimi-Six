'use client';
 
import { useState } from 'react';
import FeatureHeader from '@/components/layout/FeatureHeader';
import InputForm from './InputForm';
import RecomResult from './RecomResult';
import { JobPostingRecommendationResult } from '../types';
import { fetchJobPostingRecommendationAction, fetchCourseDetailsAction } from '../actions';
import { MySubscription } from '../../payments/types';
import { CourseFromAPI } from '../../courses/types';
 
interface RecommendationPageClientProps {
  resumeId: number | null;
  mySubscription: MySubscription | null;
  isLoggedIn: boolean;
}
 
export default function RecommendationPageClient({
  resumeId,
  mySubscription,
  isLoggedIn
}: RecommendationPageClientProps) {
  const [result, setResult] = useState<JobPostingRecommendationResult | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseFromAPI[]>([]);
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  const subscriptionText = mySubscription?.subscribed
    ? `${mySubscription.planName} / 갱신일 : ${mySubscription.expiresAt?.slice(0, 10)}`
    : '보유한 구독권이 없습니다.';

    // 분석 성공 시 recommendationId를 받아 상세 결과 조회
  const handleAnalyzeSuccess = async (recommendationId: number) => {
    setIsLoadingResult(true);
    try {
      const data = await fetchJobPostingRecommendationAction(recommendationId);
      setResult(data);
 
      if (data && data.courses.length > 0) {
        const courseIds = data.courses.map((c) => c.courseId);
        const courses = await fetchCourseDetailsAction(courseIds);
        setCourseDetails(courses);
      } else {
        setCourseDetails([]);
      }
    } finally {
      setIsLoadingResult(false);
    }
  };
 
  return (
    <div className="bg-[#F9FAFB]">
      <FeatureHeader
        icon="ai"
        title="AI 맞춤 강의 추천 (Beta)"
        description="채용공고를 등록하고 나에게 필요한 강의를 추천받아보세요."
        right={subscriptionText}
      />
 
      <div className="min-h-screen">
        <div className="max-w-275 mx-auto py-8 px-6">
          <InputForm
            resumeId={resumeId}
            hasSubscription={!!mySubscription?.subscribed}
            isLoggedIn={isLoggedIn}
            onAnalyzeSuccess={handleAnalyzeSuccess}
          />
 
          {isLoadingResult && (
            <p className="text-center text-[13.5px] text-[#6A7282] mt-6">
              분석 결과를 불러오는 중입니다...
            </p>
          )}
 
          {result && <RecomResult result={result} courseDetails={courseDetails} />}
        </div>
      </div>
    </div>
  );
}