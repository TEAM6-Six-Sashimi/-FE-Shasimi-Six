'use client';

import { useState } from 'react';
import Image from 'next/image';
import { InstructorApplication, InstructorApplicationDetail } from '../types';
import {
  approveInstructorAction,
  rejectInstructorAction,
  getApplicationDetailAction,
} from '../actions';
import InputModal from '@/components/modals/InputModal';
import { Button } from '@/components/ui/button';

interface Props {
  applicants: InstructorApplication[];
  setApplicants: React.Dispatch<React.SetStateAction<InstructorApplication[]>>;
}

export default function InstructorApproval({ applicants, setApplicants }: Props) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState<{
    applicant: InstructorApplication;
    detail: InstructorApplicationDetail | null;
  } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ applicationId: number; name: string } | null>(
    null,
  );
  const [rejectReason, setRejectReason] = useState('');

  const filtered = (applicants ?? []).filter(
    (a) => (a.name ?? '').includes(search) || (a.loginId ?? '').includes(search),
  );

  const handleViewDetail = async (applicant: InstructorApplication) => {
    try {
      setDetailLoading(true);
      const detail = await getApplicationDetailAction(applicant.applicationId);
      setDetailModal({ applicant, detail });
    } catch {
      alert('서류 정보를 불러오지 못했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApprove = async (applicationId: number) => {
    try {
      setLoading(true);
      await approveInstructorAction(applicationId);
      setApplicants((prev) => prev.filter((a) => a.applicationId !== applicationId));
      setDetailModal(null);
    } catch {
      alert('승인 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal) return;
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      // await rejectInstructorAction(rejectModal.applicationId);
      setApplicants((prev) => prev.filter((a) => a.applicationId !== rejectModal.applicationId));
      setRejectModal(null);
      setRejectReason('');
      setDetailModal(null);
    } catch {
      alert('반려 처리에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetail(a)}
                      disabled={detailLoading}
                      className="px-3 py-1.5 h-auto border-2 border-[#D1D5DB] text-[12px] font-semibold text-[#1E2125] hover:border-[#6A7282] hover:text-[#1E2125]"
                    >
                      서류 확인
                    </Button>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleApprove(a.applicationId)}
                        disabled={loading}
                        className="px-4 py-1.5 h-auto border-2 border-[#CFEE5D] text-[12px] font-semibold text-[#1E2125] bg-white hover:border-[#A8D014] hover:bg-[#F9FBE7]"
                      >
                        승인
                      </Button>
                      <Button
                        onClick={() => {
                          setRejectModal({ applicationId: a.applicationId, name: a.name });
                          setRejectReason('');
                        }}
                        disabled={loading}
                        className="px-4 py-1.5 h-auto border-2 border-[#FF5E5E] text-[12px] font-semibold text-white bg-[#FF5E5E] hover:bg-[#D14848] hover:border-[#D14848]"
                      >
                        거절
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 서류 확인 모달 */}
      {detailModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setDetailModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-bold text-[#1E2125]">강사 신청 서류</h3>
              <button
                onClick={() => setDetailModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-[#6A7282] hover:bg-[#F3F4F6] hover:text-[#1E2125] transition-colors cursor-pointer text-[18px]"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F9FAFB] rounded-xl p-4 mb-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11.5px] text-[#6A7282] mb-0.5">이름</p>
                <p className="text-[13.5px] font-semibold text-[#1E2125]">
                  {detailModal.applicant.name}
                </p>
              </div>
              <div>
                <p className="text-[11.5px] text-[#6A7282] mb-0.5">아이디</p>
                <p className="text-[13.5px] font-semibold text-[#1E2125]">
                  {detailModal.applicant.loginId}
                </p>
              </div>
              <div>
                <p className="text-[11.5px] text-[#6A7282] mb-0.5">이메일</p>
                <p className="text-[13.5px] font-semibold text-[#1E2125]">
                  {detailModal.applicant.email}
                </p>
              </div>
              <div>
                <p className="text-[11.5px] text-[#6A7282] mb-0.5">신청일</p>
                <p className="text-[13.5px] font-semibold text-[#1E2125]">
                  {detailModal.applicant.createdAt.slice(0, 10)}
                </p>
              </div>
            </div>

            {detailModal.detail ? (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-[11.5px] text-[#6A7282] mb-0.5">자기소개</p>
                  <p className="text-[13.5px] text-[#1E2125] bg-[#F9FAFB] rounded-lg px-3 py-2">
                    {detailModal.detail.bio || '-'}
                  </p>
                </div>
                {detailModal.detail.certifications?.length > 0 && (
                  <div>
                    <p className="text-[11.5px] text-[#6A7282] mb-1.5">자격증</p>
                    <div className="flex flex-col gap-2">
                      {detailModal.detail.certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="bg-[#F9FAFB] rounded-lg px-3 py-2 grid grid-cols-2 gap-2"
                        >
                          <div>
                            <p className="text-[11px] text-[#6A7282]">자격증명</p>
                            <p className="text-[13px] font-semibold text-[#1E2125]">
                              {cert.certificationName}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-[#6A7282]">발급 기관</p>
                            <p className="text-[13px] font-semibold text-[#1E2125]">
                              {cert.issuedBy}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {detailModal.detail.portfolioUrl && (
                  <div>
                    <p className="text-[11.5px] text-[#6A7282] mb-0.5">포트폴리오</p>
                    <a
                      href={detailModal.detail.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-[#5B8DEE] underline hover:text-[#3B66B9]"
                    >
                      {detailModal.detail.portfolioUrl}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-[#6A7282] text-[13px] py-4">
                서류 정보를 불러올 수 없습니다.
              </p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => handleApprove(detailModal.applicant.applicationId)}
                disabled={loading}
                className="px-5 py-2 h-auto border-2 border-[#CFEE5D] text-[13px] font-semibold text-[#1E2125] bg-white hover:border-[#A8D014] hover:bg-[#F9FBE7]"
              >
                승인
              </Button>
              <Button
                onClick={() => {
                  setRejectModal({
                    applicationId: detailModal.applicant.applicationId,
                    name: detailModal.applicant.name,
                  });
                  setRejectReason('');
                  setDetailModal(null);
                }}
                disabled={loading}
                className="px-5 py-2 h-auto border-2 border-[#FF5E5E] text-[13px] font-semibold text-white bg-[#FF5E5E] hover:bg-[#D14848] hover:border-[#D14848]"
              >
                거절
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 반려 사유 입력 모달 */}
      {/* {rejectModal && (
        <InputModal
          title="반려 사유 입력"
          subtitle={rejectModal.name}
          placeholder="반려 사유를 입력해주세요."
          value={rejectReason}
          onChange={setRejectReason}
          confirmLabel="거절"
          cancelLabel="취소"
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectModal(null)}
          loading={loading}
        />
      )} */}
    </>
  );
}
