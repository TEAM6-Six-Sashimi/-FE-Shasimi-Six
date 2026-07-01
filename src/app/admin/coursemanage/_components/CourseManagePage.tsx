'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/features/categories/types';
import {
  AdminCourse,
  RejectedCourse,
  AdminPendingCourse,
  AdminPrivateCourse,
  AdminCategory,
} from '@/features/admin/coursemanage/type';
import AllCourses from '@/features/admin/coursemanage/components/AllCourses';
import PendingCourses from '@/features/admin/coursemanage/components/PendingCourses';
import RejectedCourses from '@/features/admin/coursemanage/components/RejectedCourses';
import PrivateCourses from '@/features/admin/coursemanage/components/PrivateCourses';
import CategoryManage from '@/features/admin/coursemanage/components/category/CategoryManage';

type Tab = 'all' | 'pending' | 'rejected' | 'private' | 'category';

const VALID_TABS: Tab[] = ['all', 'pending', 'rejected', 'private', 'category'];

interface Props {
  allCourses: AdminCourse[];
  pendingCourses: AdminPendingCourse[];
  rejectedCourses: RejectedCourse[];
  privateCourses: AdminPrivateCourse[];
  courseCategories: Category[];
  adminCategories: AdminCategory[];
  accessToken: string;
}

export default function CourseManagePage({
  allCourses,
  pendingCourses,
  rejectedCourses,
  privateCourses,
  courseCategories,
  adminCategories,
  accessToken,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab = VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'all';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [pending, setPending] = useState<AdminPendingCourse[]>(pendingCourses);

  // 상세 페이지에서 승인/반려 후 router.refresh()로 서버가 새 pendingCourses를 내려주면 동기화
  useEffect(() => {
    setPending(pendingCourses);
  }, [pendingCourses]);

  // URL의 tab 쿼리가 바뀌면(뒤로가기, 주소 직접 입력 등) 탭 상태도 동기화
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
      router.replace('/admin/coursemanage', { scroll: false });
    } else {
      router.replace(`/admin/coursemanage?tab=${next}`, { scroll: false });
    }
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'all', label: '전체 강의' },
    { id: 'pending', label: `승인 대기(${pending.length})` },
    { id: 'rejected', label: '반려 이력' },
    { id: 'private', label: '비공개 강의' },
    { id: 'category', label: '카테고리 관리' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[20px] font-bold text-[#1E2125] mb-6">관리자 - 강의 관리</h1>

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

      {tab === 'all' && <AllCourses courses={allCourses} categories={courseCategories} />}
      {tab === 'pending' && (
        <PendingCourses courses={pending} setCourses={setPending} categories={courseCategories} />
      )}
      {tab === 'rejected' && (
        <RejectedCourses courses={rejectedCourses} categories={courseCategories} />
      )}
      {tab === 'private' && (
        <PrivateCourses courses={privateCourses} categories={courseCategories} />
      )}
      {tab === 'category' && (
        <CategoryManage categories={adminCategories} accessToken={accessToken} />
      )}
    </div>
  );
}
