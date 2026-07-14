'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import InstructorApproval from '@/features/admin/usermanage/components/InstructorApproval';
import RejectedList from '@/features/admin/usermanage/components/RejectedList';
import {
  AdminUser,
  InstructorApplication,
  RejectedInstructorApplication,
} from '@/features/admin/usermanage/types';
import AllUsers from '@/features/admin/usermanage/components/AllUsers';
import { useToast } from '@/components/ui/ToastContext';

type Tab = 'all' | 'approval' | 'rejected';

interface Props {
  applications: InstructorApplication[];
  users: AdminUser[];
  rejected: RejectedInstructorApplication[];
}

const VALID_TABS: Tab[] = ['all', 'approval', 'rejected'];

export default function UserManagePage({ applications, users, rejected }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab = VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'all';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [applicants, setApplicants] = useState<InstructorApplication[]>(applications ?? []);

  useEffect(() => {
    setApplicants(applications ?? []);
  }, [applications]);

  useEffect(() => {
    if (VALID_TABS.includes(tabFromUrl as Tab)) {
      setTab(tabFromUrl as Tab);
    } else {
      setTab('all');
    }
  }, [tabFromUrl]);

  // 강사 신청 승인/반려 후 리다이렉트로 전달된 ?toast= 파라미터를 읽어 토스트 표시
  const toastParam = searchParams.get('toast');
  useEffect(() => {
    if (toastParam === 'approved') {
      showToast('강사 신청이 승인되었습니다.', 'positive');
    } else if (toastParam === 'rejected') {
      showToast('강사 신청이 반려되었습니다.', 'positive');
    } else {
      return;
    }

    // 새로고침/뒤로가기 시 중복 표시되지 않도록 toast 파라미터만 제거
    const params = new URLSearchParams(searchParams.toString());
    params.delete('toast');
    const query = params.toString();
    router.replace(`/admin/usermanage${query ? `?${query}` : ''}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastParam]);

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
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
            tab === 'all'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          전체 회원
        </button>
        <button
          onClick={() => handleTabChange('approval')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
            tab === 'approval'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          강사 승인 대기({applicants.length})
        </button>
        <button
          onClick={() => handleTabChange('rejected')}
          className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
            tab === 'rejected'
              ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
              : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
          }`}
        >
          반려 이력
        </button>
      </div>

      {tab === 'all' && <AllUsers users={users ?? []} />}
      {tab === 'approval' && (
        <InstructorApproval applicants={applicants} setApplicants={setApplicants} />
      )}
      {tab === 'rejected' && <RejectedList rejected={rejected ?? []} />}
    </div>
  );
}