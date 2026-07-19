export type RecommendationInputType = 'URL' | 'TEXT';

export interface JobPostingRecommendationRequest {
  resumeId?: number;
  inputType: RecommendationInputType;
  sourceUrl?: string | null;
  rawContent?: string | null;
}

// ===== GET /recommendations/job-posting/{recommendationId} 응답 =====

export type AnalysisStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface JobPostingSummary {
  jobRole: string;
  requiredQualifications: string[];
  preferredQualifications: string[];
  experienceRequirement: string;
  mainTaskSummary: string;
}

export type FitStatus = 'SATISFIED' | 'PARTIALLY_SATISFIED' | 'NOT_SATISFIED' | 'UNKNOWN';

export interface FitCategoryResult {
  category: 'EDUCATION' | 'CAREER' | 'CERTIFICATION';
  status: FitStatus;
  requiredCondition: string;
  userCondition: string;
  comment: string;
  missingItems: string[];
}

export interface FitAnalysis {
  education: FitCategoryResult;
  career: FitCategoryResult;
  certification: FitCategoryResult;
  overallComments: string[];
}

export interface RecommendedCertificate {
  certificationId: number | null;
  name: string;
  reason: string;
  relatedSkills: string[];
  difficulty: string;
  nextExamDate: string;
  applicationStartDate: string;
  applicationEndDate: string;
}

export interface RecommendedCourse {
  courseId: number;
  title: string;
  instructor: string | null;
  matchedSkill: string;
  reason: string;
}

export interface JobPostingRecommendationResult {
  recommendationId: number;
  analysisStatus: AnalysisStatus;
  resumeBased: boolean;
  summary: JobPostingSummary | null;
  fitAnalysis: FitAnalysis | null; // resumeBased가 false or PENDING이면 null
  certificates: RecommendedCertificate[] | null;
  courses: RecommendedCourse[] | null;
  createdAt: string;
}

// POST 분석 요청 직후 받는 응답 (recommendationId만 있으면 GET으로 상세 조회)
export interface JobPostingRecommendationResponse {
  recommendationId: number;
  [key: string]: unknown;
}

export interface RecommendationApiErrorBody {
  errorCode: string;
  message: string;
  authError?: true;
}

export type AnalyzeResult =
  | { success: true; data: JobPostingRecommendationResponse }
  | { success: false; error: RecommendationApiErrorBody };

// GET /recommendations/job-posting/latest 응답 - 입력창 포커스 시 드롭다운에 보여줄 최근 분석 기록 1건
export interface LatestJobPostingRecommendation {
  recommendationId: number;
  resumeId: number | null;
  inputType: RecommendationInputType;
  sourceUrl: string | null;
  rawContent: string | null;
  analysisStatus: AnalysisStatus;
  resumeBased: boolean;
  summary: JobPostingSummary | null;
  fitAnalysis: FitAnalysis | null;
  certificates: RecommendedCertificate[];
  courses: RecommendedCourse[];
}

export interface LatestJobPostingRecommendationResponse {
  recommendation: LatestJobPostingRecommendation | null;
}
