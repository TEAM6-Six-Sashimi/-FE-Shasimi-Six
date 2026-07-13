'use client';

import Image from 'next/image';
import { useToast } from '@/components/ui/ToastContext';
import { UserMeWithAgreements } from '../../types';

interface InfoSectionProps {
  user: UserMeWithAgreements;
}

export default function InfoSection({ user }: InfoSectionProps) {
  const { showToast } = useToast();

  const handleCopyReferralCode = async () => {
    if (!user.referralCode) return;
    try {
      await navigator.clipboard.writeText(user.referralCode);
      showToast('추천인 코드가 복사되었습니다.');
    } catch {
      showToast('복사에 실패했습니다.', 'negative');
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-x-10">
      <InfoRow label="이름" value={user.name} />
      <InfoRow label="아이디" value={user.loginId} />
      <InfoRow label="생년월일" value={user.birthDate} />
      <InfoRow label="가입일" value={user.createdAt.slice(0, 10)} />
      <InfoRow label="전화번호" value={user.phone} />
      <InfoRow label="이메일" value={user.email} />
      <div className="flex items-center gap-6 py-3.5 col-span-2">
        <span className="w-20 shrink-0 text-[14px] text-[#6A7282] font-semibold">추천인 코드</span>
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-semibold text-[#FF5E5E]">
            {user.referralCode || '-'}
          </span>
          <button
            type="button"
            onClick={handleCopyReferralCode}
            className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#6A7282] border border-[#D1D5DB] rounded-md hover:bg-[#F9FAFB] cursor-pointer"
          >
            <Image src="/copy-Icon.svg" alt="" width={11} height={11} />
            복사
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-6 py-3.5 border-b border-[#F3F4F6]">
      <span className="w-20 shrink-0 text-[14px] text-[#6A7282] font-semibold">{label}</span>
      <span className="text-[14px] font-medium text-[#1E2125]">{value}</span>
    </div>
  );
}
