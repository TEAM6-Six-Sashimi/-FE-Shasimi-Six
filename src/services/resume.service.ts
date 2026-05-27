// 이력서 서비스 (/resumes CRUD + AI 평가)
import type {
  ResumeResponse,
  CreateResumeRequest,
  UpdateResumeRequest,
  ReviewResumeRequest,
  ReviewResumeResponse,
} from '@/features/user/resume/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// 내 이력서 목록 조회
export async function getMyResumes(): Promise<ResumeResponse[]> {
  const response = await fetch(`${API_BASE_URL}/resumes`, {
    method: 'GET',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('이력서 목록을 불러오지 못했습니다.');
  }

  return response.json();
}

// 이력서 단건 조회
export async function getResume(resumeId: number): Promise<ResumeResponse> {
  const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('이력서를 불러오지 못했습니다.');
  }

  return response.json();
}

// 이력서 생성
export async function createResume(payload: CreateResumeRequest): Promise<ResumeResponse> {
  const response = await fetch(`${API_BASE_URL}/resumes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || '이력서 저장에 실패했습니다.');
  }

  return response.json();
}

// 이력서 수정
export async function updateResume(
  resumeId: number,
  payload: UpdateResumeRequest,
): Promise<ResumeResponse> {
  const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || '이력서 수정에 실패했습니다.');
  }

  return response.json();
}

// 이력서 삭제
export async function deleteResume(resumeId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error('이력서 삭제에 실패했습니다.');
  }
}

// AI 이력서 평가
export async function reviewResume(
  resumeId: number,
  payload: ReviewResumeRequest = {},
): Promise<ReviewResumeResponse> {
  const response = await fetch(`${API_BASE_URL}/resumes/${resumeId}/ai-review`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'AI 평가 요청에 실패했습니다.');
  }

  return response.json();
}
