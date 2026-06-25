export type EducationStatus = '졸업' | '재학' | '휴학' | '중퇴';

export interface EducationItem {
  id: string; // 프론트 로컬 관리용 임시 id (uuid 등)
  schoolName: string;
  startDate: string; // YYYY.MM
  endDate: string; // YYYY.MM (예정일 포함)
  status: EducationStatus | '';
  major: string; // 전공 및 학위
  subMajor?: string; // 부전공 또는 연구내용 (선택)
}

export interface CareerItem {
  id: string;
  companyName: string;
  startDate: string; // YYYY.MM
  endDate: string; // YYYY.MM
  isCurrent: boolean; // 재직 중 여부
  employmentType: string; // 재직 형태 (정규직/계약직 등 자유 입력)
  position: string; // 직무 / 직책
}

export type CertificationType = '자격증' | '어학' | '운전면허' | '교육이수' | '기타';

export interface CertificationItem {
  id: string;
  type: CertificationType | '';
  name: string; // 자격증명
  issuer: string; // 발급기관
  acquiredDate: string; // 취득일자 YYYY.MM.DD 또는 YYYY.MM
  score?: string; // 점수/등급 (선택)
}

export interface ResumeFormData {
  educations: EducationItem[];
  isNewGraduate: boolean; // 신입 체크 여부
  careers: CareerItem[];
  certifications: CertificationItem[];
}

// 로그인 정보 표시용 (이미 보유 중인 UserMe를 재사용할 수도 있으나, 이력서 화면 전용으로 단순화)
export interface ResumeUserInfo {
  name: string;
  phone: string;
  email: string;
}