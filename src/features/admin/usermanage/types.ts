export interface AdminUser {
  id: number;
  name: string;
  loginId: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
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

// 강사 승인 대기 목록
export interface InstructorApplication {
  applicationId: number;
  name: string;
  loginId: string;
  email: string;
  categoryName: string;
  createdAt: string;
  verificationStatus: 'PENDING' | 'SUBMITTED';
}

export interface CertificationFile {
  fileUrl: string;
}

export type RejectionCategory =
  | 'INSUFFICIENT_CAREER_PROOF'
  | 'INSUFFICIENT_BASIC_INFO'
  | 'IDENTITY_UNVERIFIABLE'
  | 'INAPPROPRIATE_CAREER';

// 강사 승인 대기 상세
export interface InstructorApplicationDetail {
  bio: string;
  motivationLetter: string;
  categoryId: number;
  categoryName?: string; // 목록에서 가져온 이름을 보존하기 위한 보조 필드
  portfolioUrl: string;
  profileImageUrl: string;
  resumeFileUrl: string;
  mainCareers: string[] | null;
  certifications: CertificationFile[] | null;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionCategory: RejectionCategory | null;
  rejectionReason: string | null;
  approvedAt: string | null;
  createdAt: string;

  // 목록 화면에서 함께 보여주기 위해 합쳐서 내려주는 보조 필드들
  name?: string;
  loginId?: string;
  email?: string;
}

// 강사 승인 반려 이력
export interface RejectedInstructorApplication {
  applicationId: number;
  name: string;
  loginId: string;
  email: string;
  rejectedAt: string;
  rejectionCategory: RejectionCategory;
  rejectionReason: string;
}
