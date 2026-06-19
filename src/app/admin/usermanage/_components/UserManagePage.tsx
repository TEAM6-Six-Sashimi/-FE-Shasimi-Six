'use client';

import AllUsers from '@/features/admin/usermanage/components/AllUsers';
import InstructorApproval from '@/features/admin/usermanage/components/InstructorApproval';
import { InstructorApplication } from '@/features/admin/usermanage/types';
import { useState } from 'react';

type Tab = 'all' | 'approval';

interface Props {
  applications: InstructorApplication[];
}

export default function UserManagePage({ applications }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [applicants, setApplicants] = useState<InstructorApplication[]>(applications);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 회원 관리</h1>

      <div className="flex items-center border-b border-[#E5E7EB] mb-6">
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors ${
            tab === 'all'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          전체 회원
        </button>
        <button
          onClick={() => setTab('approval')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors ${
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
  );
}
