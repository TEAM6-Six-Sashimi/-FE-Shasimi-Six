export interface AdminUser {
  id: number;
  name: string;
  loginId: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  createdAt: string; 
  lastLoginAt: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface AdminUserDetail {
  name: string;
  loginId: string;
  email: string;
  phone: string;
  createdAt: string;
  lastLoginAt: string | null;
  role: 'STUDENT' | 'INSTRUCTOR';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface InstructorApplication {
  applicationId: number;
  name: string;
  loginId: string;
  email: string;
  mainCategoryName: string;
  createdAt: string;
}

export interface CertificationFile {
  certificationName: string;
  issuedBy: string;
  fileName: string;
  fileUrl: string;
}

export interface InstructorApplicationDetail {
  name: string;
  loginId: string;
  email: string;
  phone: string;
  createdAt: string;
  categoryName: string;

  introduction: string;
  motivation: string;

  certifications: CertificationFile[];

  resumeFileName: string;
  resumeFileUrl: string;
  careerHighlights: string[]; // 백엔드가 이력서에서 추출해 내려주는 주요 이력

  portfolioUrls: string[];

  agreePrivacy: boolean;
  agreePublicProfile: boolean;

  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}