// 맞춤 추천 서비스 (AI 채용공고 분석)
import type {
  CreateJobPostingRecommendationRequest,
  JobPostingRecommendationResponse,
  CourseRecommendationResponse,
  RequiredSkillRecommendationResponse,
  CertificateRecommendationResponse,
} from '@/features/user/recommendations/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// 최근 추천 조회
export async function getLatestRecommendation(): Promise<JobPostingRecommendationResponse | null> {
  const response = await fetch(`${API_BASE_URL}/recommendations/job-posting`, {
    method: 'GET',
    headers: authHeaders(),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error('최근 추천을 불러오지 못했습니다.');
  }
  return response.json();
}

// 새 추천 생성 (URL 또는 TEXT 분석)
export async function createRecommendation(
  payload: CreateJobPostingRecommendationRequest,
): Promise<JobPostingRecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendations/job-posting`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || '채용공고 분석 요청에 실패했습니다.');
  }
  return response.json();
}

// 강의 추천
export async function recommendCourses(): Promise<CourseRecommendationResponse[]> {
  const response = await fetch(`${API_BASE_URL}/recommendations/job-posting/courses`, {
    method: 'POST',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('강의 추천을 불러오지 못했습니다.');
  }
  return response.json();
}

// 요구 스킬 조회
export async function getRequiredSkills(): Promise<RequiredSkillRecommendationResponse[]> {
  const response = await fetch(`${API_BASE_URL}/recommendations/job-posting/skills`, {
    method: 'GET',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('스킬 추천을 불러오지 못했습니다.');
  }
  return response.json();
}

// 추천 자격증 조회
export async function getRecommendedCertificates(): Promise<CertificateRecommendationResponse[]> {
  const response = await fetch(`${API_BASE_URL}/recommendations/job-posting/certificates`, {
    method: 'GET',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('자격증 추천을 불러오지 못했습니다.');
  }
  return response.json();
}
