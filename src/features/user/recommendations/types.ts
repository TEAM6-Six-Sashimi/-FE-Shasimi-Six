export type RecommendationInputType = 'URL' | 'TEXT';

export interface JobPostingRecommendationRequest {
  inputType: RecommendationInputType;
  sourceUrl?: string;
  rawContent?: string;
}

// TODO: 실제 응답 스키마 확인 후 보강
export interface JobPostingRecommendationResponse {
  [key: string]: unknown;
}