'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  // 최초 진입 시(예: 즐겨찾기, 새로고침)에만 URL의 tab 쿼리를 읽어서 초기값으로 사용한다.
  const tabFromUrl = searchParams.get('tab');
  const initialTab: Tab = VALID_TABS.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'all';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [pending, setPending] = useState<AdminPendingCourse[]>(pendingCourses);

  useEffect(() => {
    setPending(pendingCourses);
  }, [pendingCourses]);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    // 이 페이지는 탭과 무관하게 데이터를 전부 미리 받아두므로 탭 전환에 서버 이동이 필요 없다.
    // router.replace를 쓰면 Next.js가 searchParams를 읽지 않는 이 라우트의 캐시를 재사용하면서
    // 예전에 방문했던 탭으로 되돌아가는 문제가 있어, 순수 클라이언트 상태 + native history API로만 URL을 동기화한다.
    const url = next === 'all' ? '/admin/coursemanage' : `/admin/coursemanage?tab=${next}`;
    window.history.replaceState(null, '', url);
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
