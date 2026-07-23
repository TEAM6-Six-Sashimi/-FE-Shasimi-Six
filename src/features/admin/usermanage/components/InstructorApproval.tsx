'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InstructorApplication } from '../types';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/Pagination';
import SearchInput from '@/components/ui/SearchInput';
import { useToast } from '@/components/ui/ToastContext';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

const ITEMS_PER_PAGE = 10;

const VERIFICATION_STATUS_LABEL: Record<InstructorApplication['verificationStatus'], string> = {
  PENDING: '대기',
  SUBMITTED: '제출됨',
};

const VERIFICATION_STATUS_BADGE_CLS: Record<InstructorApplication['verificationStatus'], string> = {
  PENDING: 'bg-[#E5E7EB]/40 text-[#6A7282]',
  SUBMITTED: 'bg-[#F9FBE7] text-[#827717]',
};

interface Props {
  applicants: InstructorApplication[];
  setApplicants: React.Dispatch<React.SetStateAction<InstructorApplication[]>>;
}

// Content-Disposition 헤더에서 파일명 추출
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
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeApplicants = applicants ?? [];

  const filtered = safeApplicants
    .filter((a) => (a.name ?? '').includes(search) || (a.loginId ?? '').includes(search))
    // 최신순(신청일)
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // 이미 진위확인 명단으로 제출된 지원자는 다시 제출 대상에 포함시키지 않는다
  // (verificationStatus가 아직 내려오지 않는 환경도 있어 대기로 취급)
  const unsubmitted = filtered.filter((a) => (a.verificationStatus ?? 'PENDING') === 'PENDING');

  const handleSubmitVerificationList = async () => {
    if (unsubmitted.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const idsParam = unsubmitted.map((a) => a.applicationId).join(',');
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
        <SearchInput
          onSearch={(v) => {
            setSearch(v);
            setCurrentPage(1);
          }}
          placeholder="이름, 아이디 검색"
        />
        <Button
          type="button"
          disabled={unsubmitted.length === 0}
          onClick={() => setShowSubmitModal(true)}
          className="h-10 px-4 border border-[#FF5F5F] bg-white hover:bg-[#FFEBEB] text-[#FF5F5F] text-[13px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
        >
          진위확인 명단 제출{unsubmitted.length > 0 ? ` (${unsubmitted.length})` : ''}
        </Button>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[5%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[8%] text-center font-semibold text-[#1E2125]">이름</th>
            <th className="py-3 w-[9%] text-center font-semibold text-[#1E2125]">회원 ID</th>
            <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">이메일</th>
            <th className="py-3 w-[13%] text-center font-semibold text-[#1E2125]">
              지원 카테고리명
            </th>
            <th className="py-3 w-[11%] text-center font-semibold text-[#1E2125]">신청일</th>
            <th className="py-3 w-[9%] text-center font-semibold text-[#1E2125]">제출 상태</th>
            <th className="py-3 w-[14%] text-center font-semibold text-[#1E2125]">서류</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center text-[#6A7282]">
                승인 대기 중인 강사가 없습니다.
              </td>
            </tr>
          ) : (
            paged.map((a, i) => (
              <tr
                key={a.applicationId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
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
                  <span
                    className={`inline-block px-2.5 py-1 rounded-sm text-[11.5px] font-semibold ${VERIFICATION_STATUS_BADGE_CLS[a.verificationStatus ?? 'PENDING']}`}
                  >
                    {VERIFICATION_STATUS_LABEL[a.verificationStatus ?? 'PENDING']}
                  </span>
                </td>
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {showSubmitModal && (
        <TwoButtonModal
          title="진위확인 명단 제출"
          message={
            <div className="flex flex-col gap-3">
              <p className="text-[15px] text-[#1E2125] font-medium leading-relaxed">
                아직 제출되지 않은 <span className="text-[#FF5E5E]">{unsubmitted.length}건</span>을
                진위확인 명단으로 제출하시겠습니까?
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
