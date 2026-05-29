'use client';

import { useState } from 'react';
import type { Category } from '@/features/categories/types';
import { AdminCourse, RejectedCourse } from '@/features/admin/coursemanage/type';
import AllCourses from '@/features/admin/coursemanage/components/AllCourses';
import PendingCourses from '@/features/admin/coursemanage/components/PendingCourses';
import RejectedCourses from '@/features/admin/coursemanage/components/RejectedCourses';

type Tab = 'all' | 'pending' | 'rejected';

interface Props {
  allCourses: AdminCourse[];
  pendingCourses: AdminCourse[];
  rejectedCourses: RejectedCourse[];
  categories: Category[];
}

export default function CourseManagePage({ allCourses, pendingCourses, rejectedCourses, categories }: Props) {
  const [tab, setTab] = useState<Tab>('all');
  const [pending, setPending] = useState<AdminCourse[]>(pendingCourses);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 강의 관리</h1>

      <div className="flex items-center border-b border-[#E5E7EB] mb-6">
        {[
          { id: 'all', label: '전체 강의' },
          { id: 'pending', label: `승인 대기(${pending.length})` },
          { id: 'rejected', label: '반려 이력' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`px-5 py-3 text-[13.5px] font-medium border-b-2 transition-colors ${
              tab === id
                ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
                : 'border-transparent text-[#6A7282] hover:text-[#1E2125]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'all' && (
        <AllCourses courses={allCourses} categories={categories} />
      )}
      {tab === 'pending' && (
        <PendingCourses
          courses={pending}
          setCourses={setPending}
          categories={categories}
        />
      )}
      {tab === 'rejected' && <RejectedCourses courses={rejectedCourses} />}
    </div>
  );
}