'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InstructorApproval from '@/features/admin/usermanage/components/InstructorApproval';
import RejectedList from '@/features/admin/usermanage/components/RejectedList';
import { AdminUser, InstructorApplication } from '@/features/admin/usermanage/types';
import AllUsers from '@/features/admin/usermanage/components/AllUsers';

type Tab = 'all' | 'approval' | 'rejected';

interface Props {
  applications: InstructorApplication[];
  users: AdminUser[];
}

const VALID_TABS: Tab[] = ['all', 'approval', 'rejected'];

export default function UserManagePage({ applications, users }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab = VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'all';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [applicants, setApplicants] = useState<InstructorApplication[]>(applications);

  useEffect(() => {
    setApplicants(applications);
  }, [applications]);

  useEffect(() => {
    if (VALID_TABS.includes(tabFromUrl as Tab)) {
      setTab(tabFromUrl as Tab);
    } else {
      setTab('all');
    }
  }, [tabFromUrl]);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    if (next === 'all') {
      router.replace('/admin/usermanage', { scroll: false });
    } else {
      router.replace(`/admin/usermanage?tab=${next}`, { scroll: false });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 회원 관리</h1>

      <div className="flex items-center border-b border-[#E5E7EB] mb-6">
        <button
          onClick={() => handleTabChange('all')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors ${
            tab === 'all'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          전체 회원
        </button>
        <button
          onClick={() => handleTabChange('approval')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors ${
            tab === 'approval'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          강사 승인 대기({applicants.length})
        </button>
        <button
          onClick={() => handleTabChange('rejected')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors ${
            tab === 'rejected'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          반려 이력
        </button>
      </div>

      {tab === 'all' && <AllUsers users={users} />}
      {tab === 'approval' && (
        <InstructorApproval applicants={applicants} setApplicants={setApplicants} />
      )}
      {tab === 'rejected' && <RejectedList />}
    </div>
  );
}