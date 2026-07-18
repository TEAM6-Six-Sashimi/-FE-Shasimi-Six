'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { InstructorApplication } from '../types';
import { Button } from '@/components/ui/button';
import Checkbox from '@/components/ui/Checkbox';
import { useToast } from '@/components/ui/ToastContext';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

const ITEMS_PER_PAGE = 10;

interface Props {
  applicants: InstructorApplication[];
  setApplicants: React.Dispatch<React.SetStateAction<InstructorApplication[]>>;
}

// Content-Disposition 헤더에서 파일명 추출 (filename*=UTF-8''... 또는 filename="..." 둘 다 대응)
function extractFilename(contentDisposition: string | null): string {
  const fallback = '자격증_진위확인_명단.xlsx';
  if (!contentDisposition) return fallback;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return fallback;
    }
  }

  const plainMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return plainMatch ? plainMatch[1] : fallback;
}

export default function InstructorApproval({ applicants, setApplicants }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeApplicants = applicants ?? [];

  const filtered = safeApplicants
    .filter((a) => (a.name ?? '').includes(search) || (a.loginId ?? '').includes(search))
    // 최신순(신청일)
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const isAllPagedSelected = paged.length > 0 && paged.every((a) => selectedIds.has(a.applicationId));

  const toggleSelect = (applicationId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(applicationId)) next.delete(applicationId);
      else next.add(applicationId);
      return next;
    });
  };

  const toggleSelectAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllPagedSelected) {
        paged.forEach((a) => next.delete(a.applicationId));
      } else {
        paged.forEach((a) => next.add(a.applicationId));
      }
      return next;
    });
  };

  const handleSubmitVerificationList = async () => {
    if (selectedIds.size === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const idsParam = Array.from(selectedIds).join(',');
      const res = await fetch(`/api/admin/verification/excel?applicationIds=${idsParam}`);

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        showToast(errorBody.error ?? '진위확인 명단 제출에 실패했습니다.', 'negative');
        return;
      }

      const blob = await res.blob();
      const filename = extractFilename(res.headers.get('content-disposition'));

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      showToast('진위확인 명단이 제출되었습니다.', 'positive');
      setSelectedIds(new Set());
      router.refresh();
    } catch {
      showToast('진위확인 명단 제출 중 오류가 발생했습니다.', 'negative');
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-[18px] font-extrabold text-[#1E2125]">강사 승인 대기</h2>
        <span className="text-[12.5px] text-[#6A7282]">
          현재 승인 대기{' '}
          <span className="text-[#FF5E5E] font-semibold">{safeApplicants.length}건</span>
        </span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="이름, 아이디 검색"
            className="w-full h-11 pl-4 pr-10 rounded-full border border-[#D1D5DB] bg-[#F9FAFB] text-[13.5px] text-[#1E2125] placeholder:text-[#6A7282] outline-none focus:border-[#1E2125] transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A7282]">
            <Image src="/search/search-Icon.svg" alt="" width={17} height={17} />
          </span>
        </div>
        <Button
          type="button"
          disabled={selectedIds.size === 0}
          onClick={() => setShowSubmitModal(true)}
          className="h-10 px-4 border border-[#FF5F5F] bg-white hover:bg-[#FFEBEB] text-[#FF5F5F] text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          진위확인 명단 제출{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
        </Button>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">
              <Checkbox
                checked={isAllPagedSelected}
                onChange={toggleSelectAllOnPage}
                ariaLabel="이 페이지 전체 선택"
              />
            </th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">이름</th>
            <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">이메일</th>
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">
              지원 카테고리명
            </th>
            <th className="py-3 w-[12%] text-center font-semibold text-[#1E2125]">신청일</th>
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">서류</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-[#6A7282]">
                승인 대기 중인 강사가 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((a) => (
              <tr
                key={a.applicationId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center">
                  <Checkbox
                    checked={selectedIds.has(a.applicationId)}
                    onChange={() => toggleSelect(a.applicationId)}
                    ariaLabel={`${a.name} 선택`}
                  />
                </td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">{a.name}</td>
                <td className="py-3 text-center text-[#6A7282]">{a.loginId}</td>
                <td className="py-3 px-2 text-center text-[#6A7282] wrap-break-word">
                  {a.email.includes('@') ? (
                    <>
                      {a.email.slice(0, a.email.indexOf('@') + 1)}
                      <wbr />
                      {a.email.slice(a.email.indexOf('@') + 1)}
                    </>
                  ) : (
                    a.email
                  )}
                </td>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#1E2125] text-white'
                  : 'text-[#6A7282] hover:bg-[#F9FAFB] hover:text-[#1E2125]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-[13px] text-[#6A7282] disabled:opacity-30 hover:text-[#1E2125] cursor-pointer"
          >
            다음
          </button>
        </div>
      )}

      {showSubmitModal && (
        <TwoButtonModal
          title="진위확인 명단 제출"
          message={
            <div className="flex flex-col gap-3">
              <p className="text-[15px] text-[#1E2125] font-medium leading-relaxed">
                선택된 <span className="text-[#FF5E5E]">{selectedIds.size}건</span>을 진위확인
                명단으로 제출하시겠습니까?
              </p>
              <p className="flex items-start gap-1.5 text-[12.5px] text-[#6A7282] leading-relaxed bg-[#F9FAFB] rounded-lg px-3 py-2.5">
                <span aria-hidden="true">ℹ</span>
                제출 후 엑셀 파일이 다운로드되며, 제출 상태로 변경됩니다.
              </p>
            </div>
          }
          confirmLabel={isSubmitting ? '제출 중...' : '제출'}
          cancelLabel="취소"
          onConfirm={handleSubmitVerificationList}
          onCancel={() => !isSubmitting && setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
