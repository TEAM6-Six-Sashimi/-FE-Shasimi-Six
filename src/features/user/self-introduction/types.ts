export type CoverLetterQuestionKey =
  | 'SELF_INTRODUCTION'
  | 'PERSONALITY'
  | 'PROJECT_EXPERIENCE'
  | 'PROBLEM_SOLVING'
  | 'CONFLICT_RESOLUTION';

// GET/PUT /cover-letters 응답의 항목 하나
export interface CoverLetterItem {
  questionKey: CoverLetterQuestionKey;
  questionTitle: string;
  content: string;
  maxLength: number;
  displayOrder: number;
}

export interface CoverLetterResponse {
  items: CoverLetterItem[];
}

export interface CoverLetterSaveItem {
  questionKey: CoverLetterQuestionKey;
  content: string;
}

// PUT /cover-letters 요청 바디
export interface CoverLetterSavePayload {
  items: CoverLetterSaveItem[];
}

export interface SelfIntroductionFormData {
  selfIntroduction: string;
  personalityProsCons: string;
  projectExperience: string;
  problemSolvingExperience: string;
  conflictResolution: string;
}

export interface SelfIntroductionQuestion {
  key: keyof SelfIntroductionFormData;
  questionKey: CoverLetterQuestionKey;
  label: string;
  placeholder: string;
  maxLength: number;
}

export const SELF_INTRODUCTION_QUESTIONS: SelfIntroductionQuestion[] = [
  {
    key: 'selfIntroduction',
    questionKey: 'SELF_INTRODUCTION',
    label: '자기 소개',
    placeholder: '자기소개를 입력해주세요.',
    maxLength: 500,
  },
  {
    key: 'personalityProsCons',
    questionKey: 'PERSONALITY',
    label: '본인 성격의 장점과 단점을 1가지씩 작성해주세요',
    placeholder: '장점과 단점 및 이유를 작성해주세요.',
    maxLength: 500,
  },
  {
    key: 'projectExperience',
    questionKey: 'PROJECT_EXPERIENCE',
    label: '본인 경력에 맞는 대표적인 프로젝트 경험을 2가지 작성해주세요.',
    placeholder: '프로젝트 경험을 작성해주세요.',
    maxLength: 500,
  },
  {
    key: 'problemSolvingExperience',
    questionKey: 'PROBLEM_SOLVING',
    label: '문제를 해결했던 경험 1가지를 작성해주세요.',
    placeholder: '문제를 해결했던 경험을 작성해주세요.',
    maxLength: 300,
  },
  {
    key: 'conflictResolution',
    questionKey: 'CONFLICT_RESOLUTION',
    label: '상사와 의견이 다를 경우 어떻게 행동하시겠습니까?',
    placeholder: '의견이 다를 경우 행동 방식을 작성해주세요.',
    maxLength: 300,
  },
];

const EMPTY_FORM: SelfIntroductionFormData = {
  selfIntroduction: '',
  personalityProsCons: '',
  projectExperience: '',
  problemSolvingExperience: '',
  conflictResolution: '',
};

// GET /cover-letters 응답 → 폼 상태로 변환 (작성 전이면 items가 전부 빈 content로 옴)
export function toFormData(items: CoverLetterItem[] | undefined): SelfIntroductionFormData {
  if (!items) return EMPTY_FORM;
  const contentByKey = new Map(items.map((item) => [item.questionKey, item.content]));

  return {
    selfIntroduction: contentByKey.get('SELF_INTRODUCTION') ?? '',
    personalityProsCons: contentByKey.get('PERSONALITY') ?? '',
    projectExperience: contentByKey.get('PROJECT_EXPERIENCE') ?? '',
    problemSolvingExperience: contentByKey.get('PROBLEM_SOLVING') ?? '',
    conflictResolution: contentByKey.get('CONFLICT_RESOLUTION') ?? '',
  };
}

// 폼 상태 → PUT /cover-letters 요청 바디로 변환
export function toSavePayload(form: SelfIntroductionFormData): CoverLetterSavePayload {
  return {
    items: SELF_INTRODUCTION_QUESTIONS.map((question) => ({
      questionKey: question.questionKey,
      content: form[question.key],
    })),
  };
}

// POST /cover-letters/review 응답
export interface CoverLetterReviewSummary {
  completedCount: number;
  totalCount: number;
  needRevisionCount: number;
  recommendedCount: number;
  spellingCorrectionCount: number;
  repeatedExpressionCount: number;
  averageSentenceLength: number;
  overallComment: string;
}

export interface CoverLetterReviewResult {
  reviewId: number;
  summary: CoverLetterReviewSummary;
}

export interface CoverLetterReviewError {
  errorCode: string;
  message: string;
  authError?: true;
}

export type CoverLetterReviewResponse =
  | { success: true; data: CoverLetterReviewResult }
  | { success: false; error: CoverLetterReviewError };

// GET /cover-letters/reviews/latest/summary 응답
export interface CoverLetterReviewDetail {
  reviewId: number;
  createdAt: string;
  summary: CoverLetterReviewSummary;
}

export interface LatestCoverLetterReviewResponse {
  review: CoverLetterReviewDetail | null;
}
