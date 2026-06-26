'use server';

import { cookies } from 'next/headers';
import { postJobPostingRecommendation } from '@/services/recommendation.service';
import {
  JobPostingRecommendationRequest,
  JobPostingRecommendationResponse,
} from './types';

export async function analyzeJobPostingAction(
  body: JobPostingRecommendationRequest,
): Promise<JobPostingRecommendationResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  // postJobPostingRecommendation이 던지는 RecommendationApiError의 message가
  // Server Action 경계를 넘어가면서 일반 Error로 직렬화되어 클라이언트에 전달됨
  return postJobPostingRecommendation(accessToken, body);
}