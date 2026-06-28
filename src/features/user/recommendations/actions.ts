'use server';

import { cookies } from 'next/headers';
import { postJobPostingRecommendation, checkUrlReachable, fetchJobPostingRecommendation } from '@/services/recommendation.service';

import {
  JobPostingRecommendationRequest, AnalyzeResult
} from './types';

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
 
// URL 탭에서 분석하기를 누르기 전, 접속 가능한 URL인지만 확인
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