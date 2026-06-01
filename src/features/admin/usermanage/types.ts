export interface InstructorApplication {
  applicationId: number;
  name: string;
  loginId: string;
  email: string;
  createdAt: string;
}

export interface InstructorApplicationDetail {
  bio: string;
  portfolioUrl: string;
  certifications: {
    certificationName: string;
    issuedBy: string;
  }[];
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt: string | null;
  createdAt: string;
}
