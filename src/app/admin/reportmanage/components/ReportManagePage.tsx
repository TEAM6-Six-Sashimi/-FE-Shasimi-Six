'use client';

import { useEffect, useState } from 'react';
import CourseReviewReports from '@/features/admin/reportmanage/components/CourseReviewReports';
import { ReviewReport } from '@/features/admin/reportmanage/types';

interface Props {
  initialReports: ReviewReport[];
}

export default function ReportManagePage({ initialReports }: Props) {
  const [reports, setReports] = useState<ReviewReport[]>(initialReports);

  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 신고 관리</h1>

      <CourseReviewReports reports={reports} setReports={setReports} />
    </div>
  );
}
