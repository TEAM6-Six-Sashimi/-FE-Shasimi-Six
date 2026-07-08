import Image from 'next/image';

interface ResumeLoginInfoProps {
  userName: string;
  userPhone: string;
  userEmail: string;
}

export default function ResumeLoginInfo({ userName, userPhone, userEmail }: ResumeLoginInfoProps) {
  return (
    // 로그인 정보 (읽기 전용)
    <section
      aria-label="로그인 정보"
      className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]"
    >
      <p className="text-[11.5px] text-[#9CA3AF] flex items-center gap-1 mb-3">
        <Image src="/auth/lock.svg" alt="자물쇠" width={13} height={13} /> 로그인 정보
      </p>
      <p className="text-[18px] font-bold text-[#1E2125] mb-1">{userName}</p>
      <div className="flex items-center gap-5 text-[13px] text-[#6A7282]">
        <span className="flex items-center gap-1">
          <Image src="/ai-resume/phone.svg" alt="전화번호" width={15} height={15} /> {userPhone}
        </span>
        <span className="flex items-center gap-1">
          <Image src="/ai-resume/email.svg" alt="이메일" width={15} height={15} /> {userEmail}
        </span>
      </div>
    </section>
  );
}
