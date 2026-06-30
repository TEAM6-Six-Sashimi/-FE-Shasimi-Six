'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AdminUser } from '../types';

type RoleFilter = 'ALL' | 'STUDENT' | 'INSTRUCTOR';

const ROLE_LABEL: Record<AdminUser['role'], string> = {
  STUDENT: '수강생',
  INSTRUCTOR: '강사',
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

// YYYY-MM-DDTHH:mm:ss → YYYY-MM-DD 로 표시 (날짜만 필요한 컬럼용)
const formatDate = (value: string | null) => (value ? value.slice(0, 10) : '-');

interface Props {
  users: AdminUser[];
}

export default function AllUsers({ users }: Props) {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.includes(search) || u.loginId.includes(search) || u.email.includes(search);
    return matchesRole && matchesSearch;
  });

  const FILTERS: { label: string; value: RoleFilter }[] = [
    { label: '전체', value: 'ALL' },
    { label: '수강생', value: 'STUDENT' },
    { label: '강사', value: 'INSTRUCTOR' },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
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

        <div className="relative w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 아이디, 이메일 검색"
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-16 text-center text-[#6A7282]">
                조건에 맞는 회원이 없습니다.
              </td>
            </tr>
          ) : (
            filtered.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{u.id}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">{u.name}</td>
                <td className="py-3 text-center text-[#6A7282]">{u.loginId}</td>
                <td className="py-3 text-center text-[#6A7282]">{u.email}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-sm text-[11.5px] font-semibold ${
                      u.role === 'INSTRUCTOR'
                        ? 'bg-[#FEF3C7]/70 text-[#92400E]'
                        : 'bg-[#EEF4FF] text-[#5B8DEE]'
                    }`}
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
    </div>
  );
}
