'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RejectDetailModal from '@/components/modals/RejectDetailModal';
import { buildDownloadHref } from '@/lib/file-url';
import {
  INSTRUCTOR_APPLICATION_STATUS_LABEL,
  INSTRUCTOR_APPLICATION_STATUS_STYLE,
  INSTRUCTOR_REJECTION_CATEGORY_LABEL,
  MyInstructorApplicationDetail,
} from '../../types';

interface InstructorApplicationDetailViewProps {
  detail: MyInstructorApplicationDetail;
  categoryName: string;
}

// 다운로드 URL이 `/files/download?key=경로%2F파일명.pdf` 형태라 key 파라미터에서 실제 파일명을 뽑아냄
const fileNameFromUrl = (url: string) => {
  try {
    const [path, query = ''] = url.split('?');
    const key = new URLSearchParams(query).get('key');
    return decodeURIComponent((key ?? path).split('/').pop() || '파일');
  } catch {
    return '파일';
  }
};

// 지원 시 프로토콜(https://) 없이 저장된 링크(github.com/... 등)도 외부 링크로 정상 연결되도록 보정
const toExternalHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const fileExtFromUrl = (url: string) => fileNameFromUrl(url).split('.').pop()?.toUpperCase() || 'FILE';


function FileRow({ url, name }: { url: string; name: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
      <div className="flex items-center gap-2.5">
        <span className="text-[#9CA3AF]">📄</span>
        <div>
          <p className="text-[13px] font-medium text-[#1E2125]">{name}</p>
          <p className="text-[11px] text-[#9CA3AF]">{fileExtFromUrl(url)}</p>
        </div>
      </div>
      <a
        href={url}
        download={name}
        className="px-3 py-1.5 rounded-md border border-[#D1D5DB] text-[12px] font-semibold text-[#1E2125] hover:bg-white transition-colors"
      >
        다운로드
      </a>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7 flex flex-col gap-3">
      <h2 className="text-[15px] font-bold text-[#1E2125]">{title}</h2>
      {children}
    </section>
  );
}

export default function InstructorApplicationDetailView({
  detail,
  categoryName,
}: InstructorApplicationDetailViewProps) {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const certifications = detail.certifications ?? [];
  const mainCareers = detail.mainCareers ?? [];
  const profileImageUrl = detail.profileImageUrl ? buildDownloadHref(detail.profileImageUrl) : null;
  const resumeFileUrl = detail.resumeFileUrl ? buildDownloadHref(detail.resumeFileUrl) : null;

  return (
    <div className="max-w-275 mx-auto flex flex-col gap-5">
      <Link
        href="/mypage/instructor-application-list"
        className="text-[13px] text-[#6A7282] hover:text-[#1E2125] transition-colors w-fit"
      >
        &lt; 강사 지원 내역 목록
      </Link>

      {/* 지원자 기본 정보 */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
        <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">지원자 기본 정보</h2>
        <div className="flex items-start gap-8">
          <div className="w-30 h-30 rounded-lg bg-[#F3F4F6] shrink-0 overflow-hidden flex items-center justify-center text-[#9CA3AF]">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={detail.userName}
                width={120}
                height={120}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <svg viewBox="0 0 24 24" className="w-12 h-12 fill-none stroke-current stroke-[1.2]">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-3 flex-1">
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">이름</p>
              <p className="text-[14.5px] font-bold text-[#1E2125]">{detail.userName}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">회원 ID</p>
              <p className="text-[14.5px] font-bold text-[#1E2125]">{detail.loginId}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">이메일</p>
              <p className="text-[14.5px] font-bold text-[#1E2125]">{detail.email}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">연락처</p>
              <p className="text-[14.5px] font-bold text-[#1E2125]">{detail.phone}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">신청일</p>
              <p className="text-[14.5px] font-bold text-[#1E2125]">
                {detail.createdAt.slice(0, 10)}
              </p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-0.5">지원 카테고리</p>
              <p className="text-[14.5px] font-bold text-[#1E2125]">{categoryName}</p>
            </div>
            <div>
              <p className="text-[11.5px] text-[#9CA3AF] mb-1">지원 상태</p>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block px-2.5 py-1 rounded-md text-[12px] font-semibold ${INSTRUCTOR_APPLICATION_STATUS_STYLE[detail.approvalStatus]}`}
                >
                  {INSTRUCTOR_APPLICATION_STATUS_LABEL[detail.approvalStatus]}
                </span>
                {detail.approvalStatus === 'REJECTED' && detail.rejectionReason && (
                  <button
                    onClick={() => setShowRejectionModal(true)}
                    className="text-[12.5px] text-[#6A7282] underline hover:text-[#1E2125] transition-colors cursor-pointer"
                  >
                    반려 사유 보기
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
        <article>
          <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">자기소개</h2>
          <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3 whitespace-pre-wrap">
            {detail.bio}
          </p>
        </article>

        <article className="mt-6">
          <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">지원 동기</h2>
          <p className="text-[13.5px] text-[#1E2125] leading-relaxed bg-[#F9FAFB] rounded-lg px-4 py-3 whitespace-pre-wrap">
            {detail.motivationLetter}
          </p>
        </article>
      </section>

      <SectionCard title="보유 자격증">
        {certifications.map((cert, idx) => (
          <FileRow
            key={idx}
            url={buildDownloadHref(cert.fileUrl)}
            name={fileNameFromUrl(cert.fileUrl)}
          />
        ))}
        {certifications.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-2">
            <p className="text-[12px] font-semibold text-[#6A7282]">자격증명</p>
            <p className="text-[12px] font-semibold text-[#6A7282]">발급 기관</p>
            {certifications.map((cert, idx) => (
              <Fragment key={idx}>
                <p className="text-[13.5px] text-[#1E2125] border border-[#E5E7EB] rounded-lg px-4 py-2.5">
                  {cert.certificationName}
                </p>
                <p className="text-[13.5px] text-[#1E2125] border border-[#E5E7EB] rounded-lg px-4 py-2.5">
                  {cert.issuedBy}
                </p>
              </Fragment>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="이력서">
        {resumeFileUrl && <FileRow url={resumeFileUrl} name={fileNameFromUrl(detail.resumeFileUrl)} />}
        {mainCareers.length > 0 && (
          <div className="mt-1">
            <p className="text-[12.5px] font-semibold text-[#1E2125] mb-2">주요 이력</p>
            <ul className="flex flex-col gap-1.5 bg-[#F9FAFB] rounded-lg px-4 py-3">
              {mainCareers.map((career, idx) => (
                <li key={idx} className="text-[13px] text-[#1E2125] flex items-start gap-1.5">
                  <span className="text-[#6A7282] mt-0.5">·</span>
                  {career}
                </li>
              ))}
            </ul>
          </div>
        )}
      </SectionCard>

      <SectionCard title="포트폴리오">
        <a
          href={toExternalHref(detail.portfolioUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13.5px] font-medium hover:underline w-fit"
        >
          • {detail.portfolioUrl}
        </a>
      </SectionCard>

      {showRejectionModal && detail.rejectionReason && (
        <RejectDetailModal
          fields={[
            { label: '지원 카테고리', value: categoryName },
            { label: '반려일', value: detail.rejectedAt?.slice(0, 10) ?? '-' },
          ]}
          category={
            detail.rejectionCategory
              ? INSTRUCTOR_REJECTION_CATEGORY_LABEL[detail.rejectionCategory]
              : '-'
          }
          detail={detail.rejectionReason}
          onClose={() => setShowRejectionModal(false)}
        />
      )}
    </div>
  );
}
