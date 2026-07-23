'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/ui/Pagination';
import SearchInput from '@/components/ui/SearchInput';
import { AdminUser } from '../types';

type RoleFilter = 'ALL' | 'STUDENT' | 'INSTRUCTOR';

const ROLE_LABEL: Record<AdminUser['role'], string> = {
  STUDENT: '수강생',
  INSTRUCTOR: '강사',
  ADMIN: '관리자',
};

const ROLE_BADGE_CLS: Record<AdminUser['role'], string> = {
  STUDENT: 'bg-[#EEF4FF] text-[#5B8DEE]',
  INSTRUCTOR: 'bg-[#FEF3C7]/70 text-[#92400E]',
  ADMIN: 'bg-[#E5E7EB]/40 text-[#6A7282]',
};

const STATUS_LABEL: Record<AdminUser['status'], string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  SUSPENDED: '정지',
};

const STATUS_BADGE_CLS: Record<AdminUser['status'], string> = {
  ACTIVE: 'bg-[#F9FBE7] text-[#827717]',
  INACTIVE: 'bg-[#E5E7EB]/40 text-[#6A7282]',
  SUSPENDED: 'bg-[#FEE2E2] text-[#B91C1C]',
};

// YYYY-MM-DDTHH:mm:ss → YYYY-MM-DD 로 표시
const formatDate = (value: string | null) => (value ? value.slice(0, 10) : '-');

const ITEMS_PER_PAGE = 10;

interface Props {
  users: AdminUser[];
}

export default function AllUsers({ users }: Props) {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = users
    .filter((u) => {
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesSearch =
        u.name.includes(search) || u.loginId.includes(search) || u.email.includes(search);
      return matchesRole && matchesSearch;
    })
    // 최근 접속일순 (접속 기록이 없는 회원은 맨 뒤로)
    .sort((a, b) => {
      if (!a.lastLoginAt) return 1;
      if (!b.lastLoginAt) return -1;
      return new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime();
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const FILTERS: { label: string; value: RoleFilter }[] = [
    { label: '전체', value: 'ALL' },
    { label: '수강생', value: 'STUDENT' },
    { label: '강사', value: 'INSTRUCTOR' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <SearchInput
          onSearch={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          placeholder="이름, 아이디, 이메일 검색"
        />

        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setRoleFilter(f.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors cursor-pointer ${
                roleFilter === f.value
                  ? 'bg-[#1E2125] text-white'
                  : 'bg-white text-[#6A7282] border border-[#D1D5DB] hover:bg-[#F9FAFB]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">이름</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[18%] text-center font-semibold text-[#1E2125]">이메일</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">역할</th>
            <th className="py-3 w-[13%] text-center font-semibold text-[#1E2125]">가입일</th>
            <th className="py-3 w-[13%] text-center font-semibold text-[#1E2125]">최근 접속일</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">상태</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">관리</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-16 text-center text-[#6A7282]">
                조건에 맞는 회원이 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((u, idx) => (
              <tr
                key={u.id}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                </td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">{u.name}</td>
                <td className="py-3 text-center text-[#6A7282]">{u.loginId}</td>
                <td className="py-3 px-2 text-center text-[#6A7282] wrap-break-word">
                  {u.email.includes('@') ? (
                    <>
                      {u.email.slice(0, u.email.indexOf('@') + 1)}
                      <wbr />
                      {u.email.slice(u.email.indexOf('@') + 1)}
                    </>
                  ) : (
                    u.email
                  )}
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-sm text-[11.5px] font-semibold ${ROLE_BADGE_CLS[u.role]}`}
                  >
                    {ROLE_LABEL[u.role]}
                  </span>
                </td>
                <td className="py-3 text-center text-[#6A7282]">{formatDate(u.createdAt)}</td>
                <td className="py-3 text-center text-[#6A7282]">{formatDate(u.lastLoginAt)}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-sm text-[11.5px] font-semibold ${STATUS_BADGE_CLS[u.status]}`}
                  >
                    {STATUS_LABEL[u.status]}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <button
                    onClick={() => router.push(`/admin/usermanage/users/${u.id}`)}
                    className="text-[12.5px] font-semibold text-[#6A7282] hover:underline cursor-pointer"
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
