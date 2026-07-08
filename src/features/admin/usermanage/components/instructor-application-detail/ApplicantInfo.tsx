import { InstructorApplicationDetail } from '@/features/admin/usermanage/types';
import { buildDownloadHref } from '@/lib/file-url';

interface ApplicantInfoProps {
  detail: InstructorApplicationDetail;
}

export default function ApplicantInfo({ detail }: ApplicantInfoProps) {
  const fieldLabelCls = 'text-[11.5px] text-[#9CA3AF] mb-1';
  const fieldValueCls = 'text-[14.5px] font-semibold text-[#1E2125]';

  const fields = [
    { label: '이름', value: detail.name ?? '-' },
    { label: '회원 ID', value: detail.loginId ?? '-' },
    { label: '이메일', value: detail.email ?? '-' },
    { label: '신청일', value: detail.createdAt.slice(0, 10) },
    { label: '지원 카테고리', value: detail.categoryName ?? `카테고리 #${detail.categoryId}` },
  ];

  return (
    <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-7">
      <h2 className="text-[15px] font-bold text-[#1E2125] mb-4">지원자 기본 정보</h2>
      <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
        <div className="w-30 h-30 rounded-lg bg-[#F3F4F6] shrink-0 overflow-hidden flex items-center justify-center text-[#9CA3AF] mx-auto sm:mx-0">
          {detail.profileImageUrl ? (
            <img
              src={buildDownloadHref(detail.profileImageUrl)}
              alt={detail.name ?? '프로필 사진'}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-none stroke-current stroke-[1.2]">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 flex-1 w-full">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className={fieldLabelCls}>{label}</dt>
              <dd className={fieldValueCls}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
