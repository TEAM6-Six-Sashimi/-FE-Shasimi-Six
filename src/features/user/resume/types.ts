// 이력서 도메인 타입
// NOTE: 백엔드가 templateType/content 단일 구조에서 섹션 분리 구조로 수정 예정.
// 아래 ResumeFormData는 피그마 기반 임시 프론트 모델이며 백엔드 스펙 확정 후 교체.

export interface EducationItem {
  id: string;
  schoolName: string;
  major: string;
  startYear: string;
  endYear: string;
}

export interface CareerItem {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface AwardItem {
  id: string;
  name: string;
  acquiredAt: string;
  type: string;
  fileName?: string;
}

export type CareerStatus = 'NEWBIE' | 'EXPERIENCED';

export interface ResumeFormData {
  title: string;
  defaultResume: boolean;

  name: string;
  phone: string;
  email: string;
  introduction: string;

  careerStatus: CareerStatus;
  educations: EducationItem[];
  careers: CareerItem[];
  skills: string[];
  awards: AwardItem[];
}

// ↓ 기존 백엔드 (구) 스펙 — AI 평가는 여전히 동작하므로 유지
export type TemplateType = 'BASIC' | 'CAREER' | 'PROJECT';

export interface ResumeResponse {
  resumeId: number;
  title: string;
  templateType: TemplateType;
  content: string;
  defaultResume: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeRequest {
  title: string;
  templateType: TemplateType;
  content: string;
  defaultResume: boolean;
}

export interface UpdateResumeRequest {
  title?: string;
  templateType?: TemplateType;
  content?: string;
  defaultResume?: boolean;
}

export interface ReviewResumeRequest {
  jobPostingId?: number | null;
}

export interface ReviewResumeResponse {
  evaluationId: number;
  overallScore: number;
  strengths: string;
  weaknesses: string;
  suggestions: string;
  evaluationAt: string;
}
