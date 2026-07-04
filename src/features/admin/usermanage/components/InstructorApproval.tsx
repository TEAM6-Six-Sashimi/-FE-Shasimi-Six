'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InstructorApplication } from '../types';
import { Button } from '@/components/ui/button';

interface Props {
  applicants: InstructorApplication[];
  setApplicants: React.Dispatch<React.SetStateAction<InstructorApplication[]>>;
}

export default function InstructorApproval({ applicants, setApplicants }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const safeApplicants = applicants ?? [];

  const filtered = safeApplicants.filter(
    (a) => (a.name ?? '').includes(search) || (a.loginId ?? '').includes(search),
  );

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[18px] font-extrabold text-[#1E2125]">강사 승인 대기</h2>
          <span className="text-[12.5px] text-[#6A7282]">
            현재 승인 대기{' '}
            <span className="text-[#FF5E5E] font-semibold">{safeApplicants.length}건</span>
          </span>
        </div>
        <div className="relative w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 아이디 검색"
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
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125]">이메일</th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">
              지원 카테고리명
            </th>
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">신청일</th>
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">서류</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                승인 대기 중인 강사가 없습니다.
              </td>
            </tr>
          ) : (
            filtered.map((a, idx) => (
              <tr
                key={a.applicationId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{idx + 1}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">{a.name}</td>
                <td className="py-3 text-center text-[#6A7282]">{a.loginId}</td>
                <td className="py-3 text-center text-[#6A7282]">{a.email}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">{a.categoryName}</td>
                <td className="py-3 text-center text-[#6A7282]">{a.createdAt?.slice(0, 10)}</td>
                <td className="py-3 text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const q = new URLSearchParams({
                        from: 'approval',
                        name: a.name ?? '',
                        loginId: a.loginId ?? '',
                        email: a.email ?? '',
                        catName: a.categoryName ?? '',
                      }).toString();
                      router.push(
                        `/admin/usermanage/instructor-applications/${a.applicationId}?${q}`,
                      );
                    }}
                    className="px-3 py-1.5 h-auto border-[1.5px] border-[#D1D5DB] text-[12px] font-semibold text-[#6A7282] hover:border-[#6A7282] hover:bg-white hover:text-[#6A7282] cursor-pointer"
                  >
                    서류 확인
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
