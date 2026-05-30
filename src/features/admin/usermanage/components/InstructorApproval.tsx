'use client';

import { useState } from 'react';
import Image from 'next/image';
import { InstructorApplication } from '../types';
import { approveInstructorAction, rejectInstructorAction } from '../actions';

interface Props {
  applicants: InstructorApplication[];
  setApplicants: React.Dispatch<React.SetStateAction<InstructorApplication[]>>;
}

export default function InstructorApproval({ applicants, setApplicants }: Props) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // const filtered = applicants.filter((a) => a.name.includes(search) || a.loginId.includes(search));
  // 백의 api 수정이 안되어서 임시로 작성함 
  const filtered = (applicants ?? []).filter(
    (a) => (a.name ?? '').includes(search) || (a.loginId ?? '').includes(search),
  );

  const handleApprove = async (applicationId: number) => {
    try {
      setLoading(true);
      await approveInstructorAction(applicationId);
      setApplicants((prev) => prev.filter((a) => a.applicationId !== applicationId));
    } catch {
      alert('승인 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      setLoading(true);
      await rejectInstructorAction(applicationId);
      setApplicants((prev) => prev.filter((a) => a.applicationId !== applicationId));
    } catch {
      alert('반려 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="pl-3 text-[18px] font-extrabold text-[#1E2125]">강사 승인 대기</h2>
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
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">이름</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">아이디</th>
            <th className="py-3 w-[25%] text-center font-semibold text-[#1E2125]">이메일</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">신청일</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">서류</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">관리</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-[#6A7282]">
                승인 대기 중인 강사가 없습니다.
              </td>
            </tr>
          ) : (
            filtered.map((a) => (
              <tr
                key={a.applicationId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center font-semibold text-[#1E2125]">{a.name}</td>
                <td className="py-3 text-center text-[#6A7282]">{a.loginId}</td>
                <td className="py-3 text-center text-[#6A7282]">{a.email}</td>
                <td className="py-3 text-center text-[#6A7282]">{a.createdAt.slice(0, 10)}</td>
                <td className="py-3 text-center">
                  <button className="px-3 py-1.5 rounded border-2 border-[#D1D5DB] text-[12px] font-semibold text-[#1E2125] bg-white hover:border-[#6A7282] cursor-pointer transition-colors">
                    서류 확인
                  </button>
                </td>
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleApprove(a.applicationId)}
                      disabled={loading}
                      className="px-4 py-1.5 rounded border-2 border-[#CFEE5D] text-[12px] font-semibold text-[#1E2125] bg-white hover:border-[#A8D014] hover:bg-[#F9FBE7] cursor-pointer transition-colors disabled:opacity-50"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(a.applicationId)}
                      disabled={loading}
                      className="px-4 py-1.5 rounded border-2 border-[#FF5E5E] text-[12px] font-semibold text-white bg-[#FF5E5E] hover:bg-[#D14848] hover:border-[#D14848] cursor-pointer transition-colors disabled:opacity-50"
                    >
                      거절
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
