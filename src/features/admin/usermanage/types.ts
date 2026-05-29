export interface InstructorApplication {
  id: number;
  userId: number;
  bio: string;
  portfolioUrl: string;
  certificationName: string;
  issuedBy: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt: string | null;
  createdAt: string;
}