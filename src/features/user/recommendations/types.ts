// 채용공고 기반 AI 추천 타입 (백엔드 OpenAPI 스펙 기반)

export type InputType = 'URL' | 'TEXT';

export type AnalysisStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface CreateJobPostingRecommendationRequest {
  inputType: InputType;
  sourceUrl?: string;
  rawContent?: string;
}

export interface JobPostingRecommendationResponse {
  recommendationId: number;
  jobTitle: string;
  analysisStatus: AnalysisStatus;
  resumeBased: boolean;
  matchRate: number;
  createdAt: string;
}

export interface CourseRecommendationResponse {
  courseId: number;
  title: string;
  instructor: string;
  matchedSkill: string;
  reason: string;
}

export interface RequiredSkillRecommendationResponse {
  name: string;
  category: string;
  matched: boolean;
}

export interface CertificateRecommendationResponse {
  certificationId: number;
  name: string;
  reason: string;
  relatedSkills: string[];
  difficulty: string;
}
