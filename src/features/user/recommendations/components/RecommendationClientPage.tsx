'use client';

import { useEffect, useRef, useState } from 'react';
import FeatureHeader from '@/components/layout/FeatureHeader';
import FullScreenLoading from '@/components/ui/FullScreenLoading';
import InputForm from './InputForm';
import RecomResult from './RecomResult';
import RecomResultSkeleton from './RecomResultSkeleton';
import { JobPostingRecommendationResult, LatestJobPostingRecommendation } from '../types';
import { fetchJobPostingRecommendationAction, fetchCourseDetailsAction } from '../actions';
import { MySubscription } from '../../payments/types';
import { CourseFromAPI } from '../../courses/types';

interface RecommendationPageClientProps {
  resumeId: number | null;
  mySubscription: MySubscription | null;
  latestRecommendation: LatestJobPostingRecommendation | null;
  isLoggedIn: boolean;
}

// polling
const POLLING_INTERVAL_MS = 1000; // 1초
const MAX_POLLING_ATTEMPTS = 40; // 최대 대기 1 * 40초(40초)

export default function RecommendationPageClient({
  resumeId,
  mySubscription,
  latestRecommendation,
  isLoggedIn,
}: RecommendationPageClientProps) {
  const [result, setResult] = useState<JobPostingRecommendationResult | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseFromAPI[]>([]);
  // PENDING 상태(polling) - 전체 화면 로딩 표시
  const [isPolling, setIsPolling] = useState(false);
  // FAILED 상태 또는 polling 시간 초과 - 에러 메시지
  const [analysisError, setAnalysisError] = useState('');

  // 컴포넌트가 사라진 후에도 polling이 계속되는 것을 막기 위한 ref
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // courseId 배열로 강의 상세 정보를 조회해서 courseDetails에 채움
  const loadCourseDetails = async (recommendation: JobPostingRecommendationResult) => {
    if (recommendation.courses && recommendation.courses.length > 0) {
      const courseIds = recommendation.courses.map((c) => c.courseId);
      const courses = await fetchCourseDetailsAction(courseIds);
      setCourseDetails(courses);
    } else {
      setCourseDetails([]);
    }
  };

  // recommendationId로 결과 조회, PENDING이면 일정 간격으로 재조회(polling)
  const pollResult = async (recommendationId: number, attempt = 0) => {
    if (!isMountedRef.current) return;

    const data = await fetchJobPostingRecommendationAction(recommendationId);

    if (!data) {
      setAnalysisError('분석 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      setIsPolling(false);
      return;
    }

    if (data.analysisStatus === 'PENDING') {
      if (attempt >= MAX_POLLING_ATTEMPTS) {
        setAnalysisError('분석이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
        setIsPolling(false);
        return;
      }
      // 아직 분석 중 - 일정 시간 후 다시 조회
      setTimeout(() => pollResult(recommendationId, attempt + 1), POLLING_INTERVAL_MS);
      return;
    }

    if (data.analysisStatus === 'FAILED') {
      setAnalysisError('채용공고 분석에 실패했습니다. 입력 내용을 확인하고 다시 시도해주세요.');
      setIsPolling(false);
      return;
    }

    // COMPLETED - 결과 확정, 강의 상세 정보까지 함께 로드
    setResult(data);
    await loadCourseDetails(data);
    setIsPolling(false);
  };

  // 분석 요청(POST) 성공 시 recommendationId를 받아 polling 시작
  const handleAnalyzeSuccess = async (recommendationId: number) => {
    setResult(null);
    setCourseDetails([]);
    setAnalysisError('');
    setIsPolling(true);

    await pollResult(recommendationId);
  };

  // 최근 분석 기록 드롭다운에서 항목 선택 시 - 해당 결과를 바로 조회해서 표시
  const handleSelectHistory = async (recommendationId: number) => {
    setAnalysisError('');
    const data = await fetchJobPostingRecommendationAction(recommendationId);

    if (!data) {
      setAnalysisError('분석 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setResult(data);
    await loadCourseDetails(data);
  };

  const subscriptionText = mySubscription?.subscribed
    ? `${mySubscription.planName} / 갱신일 : ${mySubscription.expiresAt?.slice(0, 10)}`
    : '보유한 구독권이 없습니다.';

  return (
    <div className="bg-[#F9FAFB]">
      <FeatureHeader
        icon="ai"
        title="AI 맞춤 강의 추천"
        description="채용공고를 등록하고 나에게 필요한 강의를 추천받아보세요."
        right={subscriptionText}
        rightHighlight={!mySubscription?.subscribed}
      />

      <div className="min-h-screen">
        <div className="max-w-275 mx-auto py-8 px-6">
          <InputForm
            resumeId={resumeId}
            hasSubscription={!!mySubscription?.subscribed}
            isLoggedIn={isLoggedIn}
            latestRecommendation={latestRecommendation}
            onAnalyzeSuccess={handleAnalyzeSuccess}
            onSelectHistory={handleSelectHistory}
          />

          {analysisError && (
            <p className="text-center text-[13.5px] text-[#FF5E5E] mt-6">⚠ {analysisError}</p>
          )}

          {/* polling 중에는 풀스크린 로딩 뒤로 결과 모양의 스켈레톤을 미리 보여준다 */}
          {isPolling && <RecomResultSkeleton />}

          {/* analysisStatus === 'COMPLETED' 일 때만 결과 렌더링 */}
          {!isPolling && result && result.analysisStatus === 'COMPLETED' && (
            <RecomResult result={result} courseDetails={courseDetails} />
          )}
        </div>
      </div>

      {/* PENDING 상태 - polling 중 전체 화면 로딩 */}
      {isPolling && <FullScreenLoading message="채용공고를 분석합니다..." />}
    </div>
  );
}
