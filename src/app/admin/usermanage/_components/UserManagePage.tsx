'use client';

import { useState } from 'react';
import AllUsers from '@/features/admin/usermanage/components/AllUsers';
import InstructorApproval from '@/features/admin/usermanage/components/InstructorApproval';

type Tab = 'all' | 'approval';

export interface ApplicantMock {
  id: number;
  name: string;
  loginId: string;
  email: string;
  appliedAt: string;
}

const MOCK_APPLICANTS: ApplicantMock[] = [
  {
    id: 1,
    name: '김민준',
    loginId: 'minjun01',
    email: 'minjun@email.com',
    appliedAt: '2026-05-17',
  },
  {
    id: 2,
    name: '이서연',
    loginId: 'seoyeon02',
    email: 'seoyeon@email.com',
    appliedAt: '2026-05-16',
  },
  { id: 3, name: '박지호', loginId: 'jiho03', email: 'jiho@email.com', appliedAt: '2026-05-15' },
  { id: 4, name: '최유진', loginId: 'yujin04', email: 'yujin@email.com', appliedAt: '2026-05-14' },
  {
    id: 5,
    name: '정한석',
    loginId: 'hanseok05',
    email: 'hanseok@email.com',
    appliedAt: '2026-05-13',
  },
];

export default function UserManagePage() {
  const [tab, setTab] = useState<Tab>('all');
  const [applicants, setApplicants] = useState<ApplicantMock[]>(MOCK_APPLICANTS);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-[24px] font-bold text-[#1E2125] mb-6">회원 관리</h1>

        {/* 탭 */}
        <div className="flex items-center border-b border-[#E5E7EB] mb-6">
          <button
            onClick={() => setTab('all')}
            className={`px-5 py-3 text-[15px] font-semibold border-b-2 transition-colors ${
              tab === 'all'
                ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
            }`}
          >
            전체 회원
          </button>
          <button
            onClick={() => setTab('approval')}
            className={`px-5 py-3 text-[15px] font-semibold border-b-2 transition-colors ${
              tab === 'approval'
                ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
            }`}
          >
            강사 승인 대기({applicants.length})
          </button>
        </div>

        {tab === 'all' && <AllUsers />}
        {tab === 'approval' && (
          <InstructorApproval applicants={applicants} setApplicants={setApplicants} />
        )}
      </div>
    </div>
  );
}
