'use server';

import { cookies } from 'next/headers';
import {
  postJobPostingRecommendation,
  checkUrlReachable,
  fetchJobPostingRecommendation,
  fetchLatestJobPostingRecommendation,
} from '@/services/recommendation.service';
import { fetchCoursesByIds } from '@/services/course.service';
import { JobPostingRecommendationRequest, AnalyzeResult } from './types';

export async function analyzeJobPostingAction(
  body: JobPostingRecommendationRequest,
): Promise<AnalyzeResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return {
      success: false,
      error: { errorCode: 'NO_TOKEN', message: '로그인이 필요합니다.' },
    };
  }

  return postJobPostingRecommendation(accessToken, body);
}

// 접속 가능한 URL인지 확인
export async function validateUrlAction(url: string): Promise<{ valid: boolean }> {
  const valid = await checkUrlReachable(url);
  return { valid };
}

// 분석 결과 상세 조회
export async function fetchJobPostingRecommendationAction(recommendationId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchJobPostingRecommendation(accessToken, recommendationId);
}

// 추천 결과의 추천 강의 상세 정보 한 번에 조회
export async function fetchCourseDetailsAction(courseIds: number[]) {
  return fetchCoursesByIds(courseIds);
}

// 채용공고 분석 결과 중 최신 결과 1개 조회
export async function fetchLatestJobPostingRecommendationAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) return null;

  return fetchLatestJobPostingRecommendation(accessToken);
}
