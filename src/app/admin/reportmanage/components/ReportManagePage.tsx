'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CourseReviewReports from '@/features/admin/reportmanage/components/CourseReviewReports';
import CommunityReports from '@/features/admin/reportmanage/components/CommunityReports';
import { ReviewReport } from '@/features/admin/reportmanage/types';

type Tab = 'review' | 'community';

const VALID_TABS: Tab[] = ['review', 'community'];

interface Props {
  initialReports: ReviewReport[];
}

export default function ReportManagePage({ initialReports }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab = VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'review';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [reports, setReports] = useState<ReviewReport[]>(initialReports);

  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  useEffect(() => {
    if (VALID_TABS.includes(tabFromUrl as Tab)) {
      setTab(tabFromUrl as Tab);
    } else {
      setTab('review');
    }
  }, [tabFromUrl]);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    if (next === 'review') {
      router.replace('/admin/reportmanage', { scroll: false });
    } else {
      router.replace(`/admin/reportmanage?tab=${next}`, { scroll: false });
    }
  };

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;

  const TABS: { id: Tab; label: string }[] = [
    { id: 'review', label: `수강평 신고(${pendingCount})` },
    { id: 'community', label: '커뮤니티 신고' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 신고 관리</h1>

      <div className="flex items-center border-b border-[#E5E7EB] mb-6">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors cursor-pointer ${
              tab === id
                ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'review' && <CourseReviewReports reports={reports} setReports={setReports} />}
      {tab === 'community' && <CommunityReports />}
    </div>
  );
}
