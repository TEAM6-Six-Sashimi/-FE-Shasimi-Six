export type DegreeType = 'HIGH_SCHOOL' | 'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTOR';

export const DEGREE_LABEL: Record<DegreeType, string> = {
  HIGH_SCHOOL: '고등학교 졸업',
  ASSOCIATE: '전문 학사',
  BACHELOR: '학사',
  MASTER: '석사',
  DOCTOR: '박사',
};

export type GraduationStatus =
  | 'GRADUATED'
  | 'EXPECTED_GRADUATION'
  | 'ENROLLED'
  | 'LEAVE_OF_ABSENCE'
  | 'DROPPED_OUT';

export const GRADUATION_STATUS_LABEL: Record<GraduationStatus, string> = {
  GRADUATED: '졸업',
  EXPECTED_GRADUATION: '졸업예정',
  ENROLLED: '재학',
  LEAVE_OF_ABSENCE: '휴학',
  DROPPED_OUT: '중퇴',
}

export type EmploymentType = 'PART_TIME' | 'FULL_TIME' | 'CONTRACT' | 'FREELANCER' | 'OTHER';

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
  PART_TIME: '알바',
  FULL_TIME: '정규직',
  CONTRACT: '계약직',
  FREELANCER: '프리랜서',
  OTHER: '기타',
}

export type CertificationType = 'CERTIFICATE' | 'LANGUAGE' | 'DRIVER_LICENSE' | 'EDUCATION' | 'OTHER';

export const CERTIFICATION_TYPE_LABEL: Record<CertificationType, string> = {
  CERTIFICATE: '자격증',
  LANGUAGE: '어학',
  DRIVER_LICENSE: '운전면허',
  EDUCATION: '교육이수',
  OTHER: '기타',
}

export interface EducationItem {
  id: string; // 프론트 로컬 관리용 임시 i
  schoolName: string;
  startYearMonth: string;
  endYearMonth: string;
  graduationStatus: GraduationStatus | '';
  major: string;
  degree: DegreeType | '';
  minorOrResearch?: string; 
}

export interface CareerItem {
  id: string;
  companyName: string;
  startYearMonth: string;
  endYearMonth: string;
  currentlyEmployed: boolean;
  employmentType: EmploymentType | '';
  customEmploymentType?: string; 
  jobTitle: string; 
}

export interface CertificationItem {
  id: string;
  type: CertificationType | '';
  name: string; // 자격증명
  issuer: string; // 발급기관
  acquiredDate: string; // YYYY-MM-DD
  scoreOrGrade?: string; // 점수/등급 (선택)
}

export interface ResumeFormData {
  educations: EducationItem[];
  entryLevel: boolean; // 신입 여부
  careers: CareerItem[];
  certifications: CertificationItem[];
  defaultResume?: boolean;
}

// 백엔드 요청/응답
export interface EducationPayload {
  schoolName: string;
  startYearMonth: string;
  endYearMonth: string;
  degree: DegreeType;
  major: string;
  graduationStatus: GraduationStatus;
  minorOrResearch?: string;
}
 
export interface CareerPayload {
  companyName: string;
  startYearMonth: string;
  endYearMonth: string | null; // 재직 중이면 null
  currentlyEmployed: boolean;
  employmentType: EmploymentType;
  customEmploymentType?: string | null; // OTHER일 때만
  jobTitle: string;
}
 
export interface CertificationPayload {
  name: string;
  type: CertificationType;
  issuer: string;
  acquiredDate: string;
  scoreOrGrade?: string;
}
 
export interface ResumePayload {
  educations: EducationPayload[];
  entryLevel: boolean;
  careers: CareerPayload[];
  certifications: CertificationPayload[];
  defaultResume?: boolean;
}

 
// 로그인 정보 표시용
export interface ResumeUserInfo {
  name: string;
  phone: string;
  email: string;
}

// 평가 항목
export type ReviewSectionType = 'EDUCATION' | 'CAREER' | 'CERTIFICATE';
 
export const REVIEW_SECTION_LABEL: Record<ReviewSectionType, string> = {
  EDUCATION: '학력 사항',
  CAREER: '경력 사항',
  CERTIFICATE: '자격증 사항',
};
 
// 피드백 타입
export type FeedbackType = 'STRENGTH' | 'IMPROVEMENT';
 
// 등급 기준 (점수 → 등급 변환이 필요할 경우 사용. 현재는 백엔드가 grade 문자열을 그대로 내려줌)
export function getGradeColor(score: number): { bg: string; text: string } {
  if (score >= 90) return { bg: 'bg-[#F9FBE7]', text: 'text-[#827717]' }; // 우수
  if (score >= 80) return { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]' }; // 양호
  if (score >= 61) return { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' }; // 보통
  return { bg: 'bg-[#FFEBEB]', text: 'text-[#FF5E5E]' }; // 보완 필요
}
 
// ===== 수정된 응답 타입 (기존 AiReviewResult 교체) =====
export interface SectionScore {
  type: ReviewSectionType;
  label: string;
  score: number;
  grade: string;
}
 
export interface ReviewFeedback {
  section: ReviewSectionType;
  label: string;
  type: FeedbackType;
  message: string;
}
 
export interface AiReviewResult {
  overallScore: number;
  overallGrade: string;
  sectionScores: SectionScore[];
  feedbacks: ReviewFeedback[];
}
 