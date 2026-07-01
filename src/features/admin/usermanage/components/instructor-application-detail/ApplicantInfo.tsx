import { InstructorApplicationDetail } from '@/features/admin/usermanage/types';

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
      <dl className="grid grid-cols-2 gap-x-10 gap-y-4">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <dt className={fieldLabelCls}>{label}</dt>
            <dd className={fieldValueCls}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
